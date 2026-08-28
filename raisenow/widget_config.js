// v3.2.0 - 2026-08-28 - Extract PURPOSE_AMOUNTS/CAMPAIGN_IDS tables, dedupe translations, add campaign-id test

// window.console.log('[raiseNow widget config] start');

(function () {

function getMedian(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const middleIndex = Math.floor(sorted.length / 2);
  return sorted[middleIndex];
}

function buildPurposeTranslations(defaultText) {
  // p1-p19 share one generic label; p20 is the dedicated test/parking purpose
  const purposes = {};
  for (let i = 1; i <= 19; i++) {
    purposes["p" + i] = defaultText;
  }
  purposes.p20 = "Parkplatz";
  return purposes;
}

// payment method -> campaign ID lookup group. "card" also covers unrecognized/future methods.
function campaignMethodGroup(method) {
  switch (method) {
    case "paypal":  // Paypal - replacing "pp" since tamaro v2.8.3
    case "pp":      // Paypal
      return "paypal";
    case "chqr":            // QR Rechnung
//  case "ezs":             // Einzahlungsschein
    case "dd":              // Lastschriftverfahren / Direct Debit
    case "qr-bill":         // QR Rechnung
    case "ch_qr_reference": // QR Rechnung (SD-18716)
      return "qr";
    case "twint":   // Twint - cf. SD-11883
    case "twi":     // Twint
    case "card":    // Kreditkarte - replacing "vis" and "eca" since tamaro v2.8.3
    case "vis":     // Kreditkarte - Visa
    case "eca":     // Kreditkarte - Mastercard
    case "pfc":     // Postfinance
    default:
      return "card";
  }
}

// stored_campaign_id per payment-method group and purpose; entries that also depend on
// payment_type (onetime vs. recurring) hold { onetime, recurring } instead of a plain id.
// note: RaiseNow allows max. 20 different purposes
const CAMPAIGN_IDS = {
  paypal: {
    default: "7013X000002FKzUQAW", // = p1
    p4: "7013X000002FKzuQAG",
    p5: "7013X000002FL0zQAG",
    p20: "7013X000002CkSXQA0",
  },
  qr: {
    default: "7013X000002FKzZQAW", // = p1
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
  card: {
    default: { onetime: "7013X000002FKzKQAW", recurring: "701Vj00000BZZB5IAP" }, // = p1
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

function getCampaignId(paymentMethod, purpose, paymentType) {
  const group = CAMPAIGN_IDS[campaignMethodGroup(paymentMethod)];
  const entry = Object.prototype.hasOwnProperty.call(group, purpose) ? group[purpose] : group.default;
  return typeof entry === "string" ? entry : (paymentType === "recurring" ? entry.recurring : entry.onetime);
}

function getUtmParams() {
  // get UTM parameters from URL or local storage and return as stringified object (SD-17060)
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {}; // Object to hold UTM parameters  
  ['utm_campaign', 'utm_content', 'utm_medium', 'utm_source', 'utm_term', 'dclid', 'fbclid', 'gclid', 'ttclid'].forEach(param => {
    const valueInUrl = urlParams.get(param); // Get the value of the UTM parameter
    if (valueInUrl) {
      utmParams[param] = valueInUrl.slice(0, 255); // Add to object if it exists (capped length)
    } else {
      try {
        const valueInLocalStorage = localStorage.getItem(param);
        if (valueInLocalStorage) {
          utmParams[param] = valueInLocalStorage.slice(0, 255);
        }
      } catch (e) {
        // localStorage may be unavailable (private browsing, storage restrictions)
      }
    }
  });
  return utmParams;
}

function getSpidCookie() {
  // get value of the current 'spid.' cookie
  const cookies = document.cookie.split(';');
  const spidCookie = cookies
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith('spid.'));

  if (spidCookie) {
    const value = spidCookie.substring(spidCookie.indexOf('=') + 1);
    return { spid: value };
  } else {
    return {};
  }
}

// ensure GTM dataLayer exists so tracking pushes below always land, even if GTM's own snippet hasn't run yet
window.dataLayer = window.dataLayer || [];

// set secondsToWait to 15 seconds
var secondsToWaitForRnw = 15;

var intervalCounterForRnw = 1;
var intervalLoopForRnw = setInterval(function () {
  var styleLoaded = document.head.querySelector('style[id="spendenwidget"]');
  if (
    typeof window.rnw === "object" &&
    typeof window.rnw.tamaro === "object" &&
    styleLoaded
  ) {
    // RaiseNow widget core is ready
    clearInterval(intervalLoopForRnw);

    // config and execute the widget (after the core is added!)
    if (
      typeof window.rnw === "object" &&
      typeof window.rnw.tamaro === "object"
    ) {
      // determine language of widget
      // get page language from meta tag - preferred over uri
      const supportedLanguages = ["de", "fr", "it", "en"];
      const pageLang_meta = document.head.querySelector(
        'meta[http-equiv="content-language"]'
      )?.content;
      const pageLang_metaNormalized = pageLang_meta?.toLowerCase().split("-")[0];
      var pageLang = "de"; // declare and set default
      if (!pageLang_metaNormalized || !supportedLanguages.includes(pageLang_metaNormalized)) {
        // get page language from uri
        if (window.location.href.match(/\/fr\//)) {
          pageLang = "fr";
        } else if (window.location.href.match(/\/it\//)) {
          pageLang = "it";
        } else if (window.location.href.match(/\/en\//)) {
          pageLang = "en";
        } else {
          pageLang = "de"; // practically defines the global fallback
        }
      } else {
        pageLang = pageLang_metaNormalized;
      }

      // single source of truth for per-purpose amount defaults (SD-23224 cleanup: was duplicated
      // between this page-uri lookup and the runWidget "amounts" conditions below)
      var PURPOSE_AMOUNTS = {
        p6: [25, 75, 150],
        p7: [45, 95, 150],
        p9: [45, 75, 150],
        p10: [45, 100, 150],
        p11: [45, 100, 150],
        p12: [45, 75, 150],
        p13: [25, 50, 100],
        p14: [25, 75, 150],
        p15: [45, 75, 120],
        p16: [45, 95, 150],
        p17: [45, 75, 150],
        p18: [45, 90, 150],
        p19: [125, 250, 375],
        p20: [5, 10, 20],
      };

      // set default purpose based on page uri
      var currentPurpose = "p1"; // declare and set default
      if (window.location.href.match(/.*\/de\/helfen\/spenden\/zeit-zum-durchatmen-schenken.*|.*\/fr\/soutenir\/dons\/offrez-familles-un-moment-pour-respirer.*|.*\/it\/supporto\/donare\/offra-un-momento-per-tirare-il-fiato.*/)) {
        currentPurpose = "p7";
      } else if (window.location.href.match(/.*\/gigi-malua.*/)) { // SD-22010
        currentPurpose = "p9";
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/kleiner-hase.*|.*\/fr\/soutenir\/dons\/petit-lapin.*|.*\/it\/supporto\/donare\/coniglietto.*/)) {
        currentPurpose = "p10";
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/kleine-maus.*|.*\/fr\/soutenir\/dons\/petite-souris.*|.*\/it\/supporto\/donare\/topino.*/)) {
        currentPurpose = "p11";
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/zuhoeren-kann-leben-retten-unternehmen.*/)) {
        currentPurpose = "p19";
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/zuhoeren-kann-leben-retten-social-do.*|.*\/fr\/soutenir\/dons\/ecouter-peut-sauver-des-vies-social-do.*|.*\/it\/supporto\/donare\/ascoltare-puo-salvare-vite-social-do.*/)) {
        currentPurpose = "p14";
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/zuhoeren-kann-leben-retten-mitmachen-bestaetigung.*|.*\/fr\/soutenir\/dons\/ecouter-peut-sauver-des-vies-participer-confirmation.*|.*\/it\/supporto\/donare\/ascoltare-puo-salvare-vite-participare-confirmazione.*/)) {
        currentPurpose = "p6";
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/zuhoeren-kann-leben-retten.*|.*\/fr\/soutenir\/dons\/ecouter-peut-sauver-des-vies.*|.*\/it\/supporto\/donare\/ascoltare-puo-salvare-vite.*/)) {
        currentPurpose = "p12";
      } else if (window.location.href.match(/.*\/de\/bestaetigung-ich-bin-der-kleine-hase.*|.*\/fr\/confirmation-petit-lapin.*|.*\/it\/confirmazione-piacere-sono-coniglietto.*/)) {
        currentPurpose = "p13";
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/ihre-spende-gegen-mobbing.*|.*\/fr\/soutenir\/dons\/votre-don-contre-le-harcelement.*|.*\/it\/supporto\/donare\/la-sua-donazione-contro-il-bullismo.*/)) {
        currentPurpose = "p15";
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/eltern-helfen.*|.*\/fr\/soutenir\/dons\/aider-les-parents.*|.*\/it\/supporto\/donare\/aiutare-i-genitori.*/)) { // SD-22190
        currentPurpose = "p16";
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/giving-tuesday.*|.*\/fr\/soutenir\/dons\/giving-tuesday.*|.*\/it\/supporto\/donare\/giving-tuesday.*/)) {
        currentPurpose = "p17";
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/kleine-katze.*|.*\/fr\/soutenir\/dons\/petit-chat.*|.*\/it\/supporto\/donare\/gattino.*/)) {
        currentPurpose = "p18";
      }

      // why define the amounts here, too? -> for getMedian() to work on prefill
      // -> https://support.raisenow.com/hc/en-us/articles/360018786778-Adding-conditions-in-your-configuration
      var currentAmounts = PURPOSE_AMOUNTS[currentPurpose] || [60, 120, 250]; // declare and set default

      // configure and run raiseNow widget
      window.rnw.tamaro.runWidget(".rnw-widget-container", {
        language: pageLang,
        amounts: [
          ...Object.keys(PURPOSE_AMOUNTS).map(function (purpose) {
            return {
              if: "paymentType() == onetime && purpose() == " + purpose,
              then: PURPOSE_AMOUNTS[purpose],
            };
          }),
          {
            if: "paymentType() == onetime",
            then: currentAmounts, // default or page-specific value
          },
          {
            if: "paymentType() == recurring && recurringInterval() == monthly",
            then: [20, 40, 60],
          },
          {
            if: "paymentType() == recurring && recurringInterval() == quarterly",
            then: [60, 140, 200],
          },
          {
            if: "paymentType() == recurring && recurringInterval() == semestral",
            then: [120, 180, 300],
          },
          {
            if: "paymentType() == recurring && recurringInterval() == yearly",
            then: [240, 480, 600],
          },
        ],
        autoselectAmount: true,             // added (SD-16523)
        allowCustomAmount: true,            // always show custom amount
        paymentFormPrefill: {               // https://docs.raisenow.com/elements/tamaro/concepts/configuration#paymentformprefill
          purpose: currentPurpose,
          payment_type: 'onetime',
          amount: getMedian(currentAmounts) // can't reference amounts here, hence using currentAmounts
        },
        // coverFeeFixed: 0,
        /*
        coverFeeProcessingFixed: 0,
        coverFeePlatformFixed: 0,
        coverFeeOrganisationCostsFixed: 0,
        */
        /*
        coverFeePercentage: [
          { if: "paymentMethod() == 'twint'", then: 1.3 },
          { if: "paymentMethod() == 'qr-bill'", then: 0.2 },
          { if: "paymentMethod() == 'ch_qr_reference'", then: 0.2 },
          1.25,
        ],
        */
        /*
        coverFeeProcessingPercentage: [
          { if: "paymentMethod() == 'twint'", then: 1.3 },
          { if: "paymentMethod() == 'qr-bill'", then: 0.2 },
          { if: "paymentMethod() == 'ch_qr_reference'", then: 0.2 },
          1.25,
        ],
        coverFeePlatformPercentage: 0,
        coverFeeOrganisationCostsPercentage: 0,
        */
        translations: {
          de: {
            purposes: buildPurposeTranslations("Hilfe für Kinder und Jugendliche in der Schweiz"),
            payment_form: {
              stored_cover_transaction_fee: `
                Ja, ich möchte die Transaktionsgebühren von %% toUpperCase(currency()) %% %% formattedFeeAmount() %% übernehmen, damit meine Spende vollumfänglich an Pro Juventute geht.
              `,
            },
          },
          fr: {
            purposes: buildPurposeTranslations("Aide pour enfants et des jeunes en Suisse"),
            payment_form: {
              stored_cover_transaction_fee: `
                Oui, je souhaite prendre en charge les frais de transaction de %% toUpperCase(currency()) %% %% formattedFeeAmount() %% afin que mon don parvienne entièrement à Pro Juventute.
              `,
            },
          },
          it: {
            purposes: buildPurposeTranslations("Aiuto per bambini e giovani in Svizzera"),
            payment_form: {
              stored_cover_transaction_fee: `
                Sì, desidero coprire le spese di transazione di %% toUpperCase(currency()) %% %% formattedFeeAmount() %% affinché la mia donazione venga destinata interamente a Pro Juventute.
              `,
            },
          },
        },
      });
          
      // switch campaign according to payment method selected
      window.rnw.tamaro.events.paymentMethodChanged.subscribe(function (event) {
        // set UTM parameters for Opportunity.RaiseNow__Attachment__c if available (SD-17060)
        const utmParams = getUtmParams();
        const spidCookie = getSpidCookie();
        const combined = { ...utmParams, ...spidCookie };
        event.data.api.paymentForm.data.raisenow_parameters ||= {};
        event.data.api.paymentForm.data.raisenow_parameters.fundraising_automation = Object.keys(combined).length ? { attachment: JSON.stringify(combined) } : {};
        /*
        // set fee coverage according to payment method (SD-20469)
        switch (event.data.api.paymentForm.data.payment_method) {
          case "twint":   // Twint - cf. SD-11883
          case "twi":     // Twint
            event.data.api.paymentForm.data.stored_rnw_cover_fee_percentage = 1.3;
            break;
          case "chqr":            // QR Rechnung
//        case 'ezs':             // Einzahlungsschein
          case "qr-bill":         // QR Rechnung
          case "ch_qr_reference": // QR Rechnung (SD-18716)
            event.data.api.paymentForm.data.stored_rnw_cover_fee_percentage = 0.2;
            break;
          default:
            event.data.api.paymentForm.data.stored_rnw_cover_fee_percentage = 1.25;
        }
        */
        // set campaign id according to payment method and purpose
        event.data.api.paymentForm.data.stored_campaign_id = getCampaignId(
          event.data.api.paymentForm.data.payment_method,
          event.data.api.paymentForm.data.purpose,
          event.data.api.paymentForm.data.payment_type
        );
      });
      
      // trigger tracking (GTM) event on render to re-init event listeners
      window.rnw.tamaro.events.afterRender.subscribe(function (event) {
        try {
          window.dataLayer.push({
            event: "raiseNow-afterRender",
            event_data_api_configEnv_widget: event.data.api.configEnv.WIDGET_UUID,
            event_data_api_configEnv_build: event.data.api.configEnv.BUILD_DATE
          });
        } catch (err) {
          window.console.log(
            "[raiseNow customEventHandler afterRender] error:"
          );
          window.console.error(err);
        }
      });

      // trigger tracking (GTM) event on send
      window.rnw.tamaro.events.beforePaymentSend.subscribe(function (event) {
        try {
          window.dataLayer.push({
            event: "raiseNow-beforePaymentSend",
            event_data_api_configEnv_widget: event.data.api.configEnv.WIDGET_UUID,
            event_data_api_configEnv_build: event.data.api.configEnv.BUILD_DATE,
            // , 'event_data_api_paymentForm': event.data.api.paymentForm
            event_data_api_transactionInfo_amount: event.data.api.paymentForm.data?.amount,
            event_data_api_transactionInfo_paymentMethod: event.data.api.paymentForm.data?.payment_method,
            event_data_api_transactionInfo_purposeId: event.data.api.paymentForm.data?.purpose
          });
        } catch (err) {
          window.console.log(
            "[raiseNow customEventHandler beforePaymentSend] error:"
          );
          window.console.error(err);
        }
      });

      // trigger tracking (GTM) event on completion
      window.rnw.tamaro.events.paymentComplete.subscribe(function (event) {
        try {
          window.dataLayer.push({
            event: "raiseNow-paymentComplete",
            event_data_api_configEnv_widget: event.data.api.configEnv.WIDGET_UUID,
            event_data_api_configEnv_build: event.data.api.configEnv.BUILD_DATE,
            // , 'event_data_api_paymentForm': event.data.api.paymentForm
            event_data_api_transactionInfo_amount: event.data.api.transactionInfo?.amount ?? event.data.api.epmsPaymentAgreementInfo?.amount,
            event_data_api_transactionInfo_epaymentStatus: event.data.api.transactionInfo?.epayment_status ?? event.data.api.epmsPaymentAgreementInfo?.last_status,
            event_data_api_transactionInfo_paymentMethod: event.data.api.transactionInfo?.payment_method ?? event.data.api.epmsPaymentAgreementInfo?.payment_method,
            event_data_api_transactionInfo_purposeId: event.data.api.transactionInfo?.stored_rnw_purpose_id ?? event.data.api.epmsPaymentAgreementInfo?.custom_parameters?.rnw_purpose_id,
            event_data_api_transactionInfo_transactionId: event.data.api.transactionInfo?.epp_transaction_id ?? event.data.api.transactionInfo?.epms_payment_uuid ?? event.data.api.epmsPaymentAgreementInfo?.uuid,
            event_data_api_customer_email: event.data.api.transactionInfo?.stored_customer_email ?? event.data.api.epmsPaymentAgreementInfo?.supporter_snapshot?.email
          });
        } catch (err) {
          window.console.log(
            "[raiseNow customEventHandler paymentComplete] error:"
          );
          window.console.error(err);
        }
      });
    }
  } else if (intervalCounterForRnw >= secondsToWaitForRnw * 2) {
    // after X * 2 tries = X seconds, stop the loop
    clearInterval(intervalLoopForRnw);
    window.console.log(
      "[raiseNow widget core] -> warning: waited too long, widget core not ready"
    );
    window.dataLayer.push({ event: "raiseNow-loadFailed" });
  } else {
    intervalCounterForRnw++;
  }
}, 500);

})();

// window.console.log('     widget config complete');
