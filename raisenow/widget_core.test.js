const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const readScript = (name) => readFileSync(__dirname + "/" + name, "utf8");

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
  assert.equal(appended[0].attributes.defer, "");
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
