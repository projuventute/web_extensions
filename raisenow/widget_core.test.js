const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const readScript = (name) => readFileSync(__dirname + "/" + name, "utf8");

// Shared harness for widget_config.js: getMedian/getUtmParams/getSpidCookie/getCampaignId etc.
// live inside its IIFE (deliberately, so they don't leak onto window) and aren't reachable
// directly, so tests observe them through the real runWidget config and event handlers.
function loadWidgetConfig({
  href = "https://www.projuventute.ch/de/some-page",
  search = "",
  metaLang,
  cookie = "",
  localStorageData = {}, // null simulates localStorage throwing (e.g. private browsing)
  autoReady = true,
  rnwReady = true, // false leaves window.rnw unset, so the poller never finds it ready
} = {}) {
  const runWidgetCalls = [];
  const handlers = {};
  const consoleLogs = [];
  let intervalCallback;
  let clearedInterval;
  const context = {
    clearInterval: (id) => { clearedInterval = id; },
    console: { log: (msg) => consoleLogs.push(msg), error() {} },
    document: {
      head: {
        querySelector: (selector) => {
          if (selector === 'style[id="spendenwidget"]') return {};
          if (selector === 'meta[http-equiv="content-language"]') {
            return metaLang !== undefined ? { content: metaLang } : undefined;
          }
          return undefined;
        },
      },
      cookie,
    },
    localStorage: localStorageData === null
      ? { getItem: () => { throw new Error("storage blocked"); } }
      : { getItem: (key) => Object.prototype.hasOwnProperty.call(localStorageData, key) ? localStorageData[key] : null },
    URLSearchParams,
    setInterval: (callback) => { intervalCallback = callback; return "poller"; },
    window: { location: { href, search } },
  };
  context.window.console = context.console;
  if (rnwReady) {
    context.window.rnw = {
      tamaro: {
        events: Object.fromEntries(
          ["afterRender", "beforePaymentSend", "paymentComplete", "paymentMethodChanged"].map(
            (name) => [name, { subscribe: (handler) => { handlers[name] = handler; } }]
          )
        ),
        runWidget: (...args) => runWidgetCalls.push(args),
      },
    };
  }

  vm.runInNewContext(readScript("widget_config.js"), context);
  if (autoReady) intervalCallback();

  return {
    context,
    handlers,
    runWidgetCalls,
    consoleLogs,
    intervalCallback,
    getClearedInterval: () => clearedInterval,
  };
}

test("keeps legacy Tamaro startup while safely injecting style and tracking data", () => {
  const source = readScript("widget_core.js");
  const config = readScript("widget_config.js");
  const style = readScript("widget_style.js");

  assert.match(source, /tamaro\.raisenow\.com\/projuventute\/latest\/widget\.js/);
  assert.doesNotMatch(source, /@raisenow\/tamaro-core@2/);
  assert.match(config, /setInterval/);
  assert.match(config, /window\.rnw\.tamaro\.runWidget/);
  assert.doesNotMatch(config, /tamaroCore/);
  assert.doesNotMatch(config, /raisenow-core-ready/);
  assert.doesNotMatch(style, /document\.head\.innerHTML/);
  assert.match(style, /document\.head\.append\(widgetStyle\)/);
  assert.match(config, /raisenow_parameters \|\|= \{\}/);
  assert.match(config, /window\.rnw\.tamaro\.events\.paymentMethodChanged/);
});

test("adds widget style once without rewriting the document head", () => {
  const elements = new Map();
  let appendCount = 0;
  const context = {
    document: {
      getElementById: (id) => elements.get(id),
      createElement: (tagName) => ({ tagName }),
      head: {
        append: (element) => {
          appendCount++;
          elements.set(element.id, element);
        },
      },
    },
  };

  vm.runInNewContext(readScript("widget_style.js"), context);
  vm.runInNewContext(readScript("widget_style.js"), context);

  assert.equal(appendCount, 1);
  assert.equal(elements.get("spendenwidget").tagName, "style");
  assert.match(elements.get("spendenwidget").textContent, /tamaro-primary-color/);
});

test("loads legacy Tamaro widget script into the widget container", () => {
  const appended = [];
  const context = {
    document: {
      createElement: (tagName) => ({
        tagName,
        attributes: {},
        setAttribute(name, value) {
          this.attributes[name] = value;
        },
      }),
      getElementsByClassName: () => [{ append: (element) => appended.push(element) }],
    },
  };

  vm.runInNewContext(readScript("widget_core.js"), context);

  assert.equal(appended.length, 1);
  assert.equal(appended[0].tagName, "script");
  assert.equal(appended[0].attributes.src, "https://tamaro.raisenow.com/projuventute/latest/widget.js");
});

test("polls until legacy Tamaro and widget style are ready", () => {
  let intervalCallback;
  let clearedInterval;
  const runWidgetCalls = [];
  const subscriptions = {
    afterRender: [],
    beforePaymentSend: [],
    paymentComplete: [],
    paymentMethodChanged: [],
  };
  const context = {
    clearInterval: (id) => {
      clearedInterval = id;
    },
    console: { log() {} },
    document: {
      head: {
        querySelector: (selector) => selector === 'style[id="spendenwidget"]' ? {} : undefined,
      },
    },
    setInterval: (callback) => {
      intervalCallback = callback;
      return "poller";
    },
    window: {
      location: { href: "https://www.projuventute.ch/de/helfen/spenden" },
    },
  };

  vm.runInNewContext(readScript("widget_config.js"), context);
  assert.equal(runWidgetCalls.length, 0);

  context.window.rnw = {
    tamaro: {
      events: Object.fromEntries(Object.entries(subscriptions).map(([name, handlers]) => [name, {
        subscribe: (handler) => handlers.push(handler),
      }])),
      runWidget: (...args) => runWidgetCalls.push(args),
    },
  };
  intervalCallback();

  assert.equal(clearedInterval, "poller");
  assert.equal(runWidgetCalls.length, 1);
  assert.equal(runWidgetCalls[0][0], ".rnw-widget-container");
  assert.equal(subscriptions.paymentMethodChanged.length, 1);
});

test("maps payment method, purpose, and payment type to the correct Salesforce campaign id", () => {
  // expected ids are typed independently of widget_config.js's CAMPAIGN_IDS table, so an
  // accidental edit to that table (wrong purpose, swapped id, dropped entry) fails this test
  // even though both "happen" to agree today. One representative method alias per RaiseNow
  // group (plus one unrecognized method, which must fall back to the card group).
  const EXPECTED = {
    pp: { // paypal group
      p1: "7013X000002FKzUQAW", p2: "7013X000002FKzUQAW", p3: "7013X000002FKzUQAW",
      p4: "7013X000002FKzuQAG",
      p5: "7013X000002FL0zQAG",
      p6: "7013X000002FKzUQAW", p7: "7013X000002FKzUQAW", p8: "7013X000002FKzUQAW",
      p9: "7013X000002FKzUQAW", p10: "7013X000002FKzUQAW", p11: "7013X000002FKzUQAW",
      p12: "7013X000002FKzUQAW", p13: "7013X000002FKzUQAW", p14: "7013X000002FKzUQAW",
      p15: "7013X000002FKzUQAW", p16: "7013X000002FKzUQAW", p17: "7013X000002FKzUQAW",
      p18: "7013X000002FKzUQAW", p19: "7013X000002FKzUQAW",
      p20: "7013X000002CkSXQA0",
    },
    "ch_qr_reference": { // qr / direct-debit group
      p1: "7013X000002FKzZQAW",
      p2: "701Vj00000bkXDaIAM",
      p3: "701Vj00000NHXASIA5",
      p4: "7013X000002FL03QAG",
      p5: "7013X000002FL10QAG",
      p6: "701Vj00000TmDTmIAN",
      p7: "701Vj00000gfcSZIAY",
      p8: { onetime: "701Vj00000CfjH6IAJ", recurring: "7013X000002FKzZQAW" },
      p9: "701Vj00000cmmR6IAI",
      p10: "701Vj00000KXGLsIAP",
      p11: "701Vj00000KXM34IAH",
      p12: "701Vj00000TGKOkIAP",
      p13: "701Vj00000KgaV6IAJ",
      p14: "701Vj00000VdyaNIAR",
      p15: "701Vj00000RkmLSIAZ",
      p16: "701Vj00000dNR2hIAG",
      p17: "701Vj00000XEWxwIAH",
      p18: "701Vj00000b22JnIAI",
      p19: "701Vj00000TVCH7IAP",
      p20: "7013X000002CkSSQA0",
    },
    vis: { // card / twint / postfinance group
      p1: { onetime: "7013X000002FKzKQAW", recurring: "701Vj00000BZZB5IAP" },
      p2: { onetime: "701Vj00000bkZWyIAM", recurring: "701Vj00000bkarDIAQ" },
      p3: "701Vj00000NHbdqIAD",
      p4: "7013X000002FKztQAG",
      p5: "7013X000002FL0vQAG",
      p6: "701Vj00000TmJVwIAN",
      p7: { onetime: "701Vj00000gfXj5IAE", recurring: "701Vj00000gfMCZIA2" },
      p8: { onetime: "701Vj00000CfiB4IAJ", recurring: "701Vj00000BZZB5IAP" },
      p9: "701Vj00000cmndJIAQ",
      p10: "701Vj00000KXKA8IAP",
      p11: "701Vj00000KXEf3IAH",
      p12: "701Vj00000TGJfdIAH",
      p13: "701Vj00000KgbsWIAR",
      p14: "701Vj00000Ve0XLIAZ",
      p15: "701Vj00000RknsbIAB",
      p16: { onetime: "701Vj00000dNTHNIA4", recurring: "701Vj00000dNSOYIA4" },
      p17: "701Vj00000XEaYXIA1",
      p18: { onetime: "701Vj00000b1q5sIAA", recurring: "701Vj00000b208LIAQ" },
      p19: "701Vj00000TV0FzIAL",
      p20: "7013X000002CkSNQA0",
    },
  };
  // an unrecognized payment method must fall back to the card group's p1 default
  EXPECTED.unknown_method = { p1: EXPECTED.vis.p1 };

  const handlers = {};
  const context = {
    clearInterval: () => {},
    console: { log() {}, error() {} },
    document: {
      head: { querySelector: (selector) => selector === 'style[id="spendenwidget"]' ? {} : undefined },
      cookie: "",
    },
    localStorage: { getItem: () => null },
    URLSearchParams,
    setInterval: (callback) => { callback(); return "poller"; },
    window: { location: { href: "https://www.projuventute.ch/de/some-page", search: "" } },
  };
  context.window.rnw = {
    tamaro: {
      events: Object.fromEntries(
        ["afterRender", "beforePaymentSend", "paymentComplete", "paymentMethodChanged"].map(
          (name) => [name, { subscribe: (handler) => { handlers[name] = handler; } }]
        )
      ),
      runWidget: () => {},
    },
  };

  vm.runInNewContext(readScript("widget_config.js"), context);

  for (const [payment_method, purposes] of Object.entries(EXPECTED)) {
    for (const [purpose, expected] of Object.entries(purposes)) {
      const types = typeof expected === "string" ? { onetime: expected, recurring: expected } : expected;
      for (const [payment_type, expectedId] of Object.entries(types)) {
        const data = { payment_method, purpose, payment_type };
        handlers.paymentMethodChanged({ data: { api: { paymentForm: { data } } } });
        assert.equal(
          data.stored_campaign_id,
          expectedId,
          `method=${payment_method} purpose=${purpose} type=${payment_type}`
        );
      }
    }
  }
});

test("collects UTM/click-id params from the URL, preferring them over localStorage, capped at 255 chars", () => {
  const longValue = "x".repeat(300);
  const { handlers } = loadWidgetConfig({
    search: `?utm_source=newsletter&utm_campaign=${longValue}`,
    localStorageData: { utm_source: "should-be-ignored-url-wins", utm_medium: "from-storage" },
  });
  const data = { payment_method: "twint", purpose: "p1", payment_type: "onetime" };
  handlers.paymentMethodChanged({ data: { api: { paymentForm: { data } } } });
  const attachment = JSON.parse(data.raisenow_parameters.fundraising_automation.attachment);

  assert.equal(attachment.utm_source, "newsletter"); // URL value wins over localStorage
  assert.equal(attachment.utm_medium, "from-storage"); // localStorage used when URL param absent
  assert.equal(attachment.utm_campaign, longValue.slice(0, 255)); // capped at 255 chars
});

test("falls back safely when localStorage is unavailable (e.g. private browsing)", () => {
  const { handlers } = loadWidgetConfig({ localStorageData: null }); // getItem throws
  const data = { payment_method: "twint", purpose: "p1", payment_type: "onetime" };

  assert.doesNotThrow(() => handlers.paymentMethodChanged({ data: { api: { paymentForm: { data } } } }));
  // cross-realm object from vm context; compare shape, not identity/prototype
  assert.equal(Object.keys(data.raisenow_parameters.fundraising_automation).length, 0);
});

test("reads the spid. cookie and merges it into the fundraising attachment", () => {
  const { handlers } = loadWidgetConfig({ cookie: "other=1; spid.abc=xyz-123; another=2" });
  const data = { payment_method: "twint", purpose: "p1", payment_type: "onetime" };
  handlers.paymentMethodChanged({ data: { api: { paymentForm: { data } } } });
  const attachment = JSON.parse(data.raisenow_parameters.fundraising_automation.attachment);

  assert.equal(attachment.spid, "xyz-123");
});

test("sets an empty fundraising_automation object when no UTM params or spid cookie exist", () => {
  const { handlers } = loadWidgetConfig({}); // no search, no cookie, empty localStorage
  const data = { payment_method: "twint", purpose: "p1", payment_type: "onetime" };
  handlers.paymentMethodChanged({ data: { api: { paymentForm: { data } } } });

  // cross-realm object from vm context; compare shape, not identity/prototype
  assert.equal(Object.keys(data.raisenow_parameters.fundraising_automation).length, 0);
});

test("resolves purpose, per-purpose amounts, and median prefill amount from the page uri", () => {
  // [href, expected currentPurpose, expected median of PURPOSE_AMOUNTS[purpose] (or the [60,120,250] default)]
  const cases = [
    ["https://www.projuventute.ch/de/some-unmatched-page", "p1", 120],
    ["https://www.projuventute.ch/de/helfen/spenden/zeit-zum-durchatmen-schenken", "p7", 95],
    ["https://www.projuventute.ch/fr/soutenir/dons/offrez-familles-un-moment-pour-respirer", "p7", 95],
    ["https://www.projuventute.ch/gigi-malua", "p9", 75],
    ["https://www.projuventute.ch/de/helfen/spenden/kleiner-hase", "p10", 100],
    ["https://www.projuventute.ch/it/supporto/donare/coniglietto", "p10", 100],
    ["https://www.projuventute.ch/de/helfen/spenden/kleine-maus", "p11", 100],
    ["https://www.projuventute.ch/de/helfen/spenden/zuhoeren-kann-leben-retten-unternehmen", "p19", 250],
    ["https://www.projuventute.ch/de/helfen/spenden/zuhoeren-kann-leben-retten-social-do", "p14", 75],
    ["https://www.projuventute.ch/de/helfen/spenden/zuhoeren-kann-leben-retten-mitmachen-bestaetigung", "p6", 75],
    ["https://www.projuventute.ch/de/helfen/spenden/zuhoeren-kann-leben-retten", "p12", 75],
    ["https://www.projuventute.ch/de/bestaetigung-ich-bin-der-kleine-hase", "p13", 50],
    ["https://www.projuventute.ch/de/helfen/spenden/ihre-spende-gegen-mobbing", "p15", 75],
    ["https://www.projuventute.ch/de/helfen/spenden/eltern-helfen", "p16", 95],
    ["https://www.projuventute.ch/de/helfen/spenden/giving-tuesday", "p17", 75],
    ["https://www.projuventute.ch/de/helfen/spenden/kleine-katze", "p18", 90],
  ];

  for (const [href, expectedPurpose, expectedMedian] of cases) {
    const { runWidgetCalls } = loadWidgetConfig({ href });
    const config = runWidgetCalls[0][1];
    assert.equal(config.paymentFormPrefill.purpose, expectedPurpose, href);
    // exercises getMedian() with the actual 3-element amount arrays it's ever called with in
    // production; getMedian isn't reachable in isolation (kept private inside the IIFE)
    assert.equal(config.paymentFormPrefill.amount, expectedMedian, href);
  }
});

test("stops polling and reports load failure after waiting too long for the widget core", () => {
  const { context, intervalCallback, consoleLogs, getClearedInterval } = loadWidgetConfig({ autoReady: false, rnwReady: false });
  // window.rnw never becomes ready; secondsToWaitForRnw(15) * 2 = 30 ticks before giving up

  for (let i = 0; i < 29; i++) intervalCallback();
  assert.equal(getClearedInterval(), undefined);
  assert.equal(context.window.dataLayer.some((e) => e.event === "raiseNow-loadFailed"), false);

  intervalCallback(); // 30th tick crosses the threshold
  assert.equal(getClearedInterval(), "poller");
  assert.ok(consoleLogs.some((msg) => msg.includes("waited too long")));
  assert.ok(context.window.dataLayer.some((e) => e.event === "raiseNow-loadFailed"));
});

test("resolves widget language from content-language meta (normalized) or falls back to the uri, defaulting to german", () => {
  const cases = [
    // valid meta (with region subtag) wins even over a conflicting uri
    { metaLang: "DE-CH", href: "https://www.projuventute.ch/fr/some-page", expected: "de" },
    // unsupported/garbage meta value falls back to uri matching
    { metaLang: "xx", href: "https://www.projuventute.ch/fr/some-page", expected: "fr" },
    // no meta tag at all, uri match
    { metaLang: undefined, href: "https://www.projuventute.ch/it/some-page", expected: "it" },
    // neither meta nor uri indicate a language -> global default
    { metaLang: undefined, href: "https://www.projuventute.ch/some-page", expected: "de" },
  ];

  for (const { metaLang, href, expected } of cases) {
    const { runWidgetCalls } = loadWidgetConfig({ metaLang, href });
    assert.equal(runWidgetCalls[0][1].language, expected, `meta=${metaLang} href=${href}`);
  }
});

test("skips inserting the widget core script when the container element is missing", () => {
  const context = {
    window: { console: { log() {} } },
    document: {
      getElementsByClassName: () => [],
    },
  };

  assert.doesNotThrow(() => vm.runInNewContext(readScript("widget_core.js"), context));
});
