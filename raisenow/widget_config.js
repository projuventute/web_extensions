// v2.4.0 - 2025-09-25

// window.console.log('[raiseNow widget config] start');

function getMedian(arr) {
  arr.sort((a, b) => a - b);
  const middleIndex = Math.floor(arr.length / 2);
  return arr[middleIndex];
}

// set secondsToWait to 15 seconds
var secondsToWaitForRnw = 15;

var intervalCounterForRnw = 1;
intervalLoopForRnw = setInterval(function () {
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
      const pageLang_meta = document.head.querySelector(
        'meta[http-equiv="content-language"]'
      ).content;
      var pageLang = "de"; // declare and set default
      if (typeof pageLang_meta === "undefined" || pageLang_meta === "") {
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
        pageLang = pageLang_meta;
      }

      // set default purpose and amounts based on page uri
      // why define the amounts here, too? -> for getMedian() to work on prefill
      // -> https://support.raisenow.com/hc/en-us/articles/360018786778-Adding-conditions-in-your-configuration
      var currentPurpose = "p1"; // declare and set default
      var currentAmounts = [60, 120, 250]; // declare and set default
      if (window.location.href.match(/.*\/de\/bestaetigung-geburtstagskalender.*|.*\/fr\/confirmation-calendrier-anniversaires.*|.*\/it\/confirmazione-calendario-compleanni.*/)) {  // SD-17437
        currentPurpose = "p2";
        currentAmounts = [20, 30, 50];
      } else if (window.location.href.match(/.*\/de\/so-koennen-sie-helfen.*/)) {  // SD-12555
        currentPurpose = "p7";
      } else if (window.location.href.match(/.*\/adventskalender-24-ideen-fuer-gemeinsame-erlebnisse.*|.*\/le-calendrier-de-lavent.*|\/calendario-dellavvento.*/)) { // SD-14716
        currentPurpose = "p9";
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/kleiner-hase.*|.*\/fr\/soutenir\/dons\/petit-lapin.*|.*\/it\/supporto\/donare\/coniglietto.*/)) {
        currentPurpose = "p10";
        currentAmounts = [45, 100, 150];
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/kleine-maus.*|.*\/fr\/soutenir\/dons\/petite-souris.*|.*\/it\/supporto\/donare\/topino.*/)) {
        currentPurpose = "p11";
        currentAmounts = [45, 100, 150];
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/zuhoeren-kann-leben-retten-unternehmen.*/)) {
        currentPurpose = "p19";
        currentAmounts = [125, 250, 375];
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/zuhoeren-kann-leben-retten.*|.*\/fr\/soutenir\/dons\/ecouter-peut-sauver-des-vies.*|.*\/it\/supporto\/donare\/ascoltare-puo-salvare-vite.*/)) {
        currentPurpose = "p12";
        currentAmounts = [45, 75, 150];
      } else if (window.location.href.match(/.*\/de\/bestaetigung-ich-bin-der-kleine-hase.*|.*\/fr\/confirmation-petit-lapin.*|.*\/it\/confirmazione-piacere-sono-coniglietto.*/)) {
        currentPurpose = "p13";
        currentAmounts = [25, 50, 100];
      } else if (window.location.href.match(/.*\/(de\/danke|fr\/merci|it\/grazie).*/)) {
        currentPurpose = "p14";
        currentAmounts = [45, 90, 150];
      } else if (window.location.href.match(/.*\/de\/helfen\/spenden\/ihre-spende-gegen-mobbing.*|.*\/fr\/soutenir\/dons\/votre-don-contre-le-harcelement.*|.*\/it\/supporto\/donare\/la-sua-donazione-contro-il-bullismo.*/)) {
        currentPurpose = "p15";
        currentAmounts = [45, 75, 120];
      } else if (window.location.href.match(/.*\/de\/sarah-fehlt.*|.*\/fr\/sarah-manque.*|.*\/it\/sarah-manca.*/)) {  // SD-13753 + SD-14721
        currentPurpose = "p16";
        currentAmounts = [45, 75, 120];
      } else if (window.location.href.match(/.*\/(weltkindertag|de\/node\/1357).*/)) {
        currentPurpose = "p17";
        currentAmounts = [60, 120, 240];
      } else if (window.location.href.match(/.*\/meine-spende-rettet-leben.*|.*\/mon-don-sauve-des-vies.*|.*\/la-mia-donazione-salva-delle-vite.*/)) {
        currentPurpose = "p18";
      } 

      // configure raiseNow widget
      window.rnw.tamaro.runWidget(".rnw-widget-container", {
        language: pageLang,
        amounts: [
          {
            if: "paymentType() == onetime && purpose() == p2",
            then: [20, 30, 50],
          },
          {
            if: "paymentType() == onetime && purpose() == p10",
            then: [45, 100, 150],
          },
          {
            if: "paymentType() == onetime && purpose() == p11",
            then: [45, 100, 150],
          },
          {
            if: "paymentType() == onetime && purpose() == p12",
            then: [45, 75, 150],
          },
          {
            if: "paymentType() == onetime && purpose() == p13",
            then: [25, 50, 100],
          },
          {
            if: "paymentType() == onetime && purpose() == p14",
            then: [45, 90, 150],
          },
          {
            if: "paymentType() == onetime && purpose() == p15",
            then: [45, 75, 120],
          },
          {
            if: "paymentType() == onetime && purpose() == p16",
            then: [45, 75, 120],
          },
          {
            if: "paymentType() == onetime && purpose() == p17",
            then: [60, 120, 240],
          },
          {
            if: "paymentType() == onetime && purpose() == p19",
            then: [125, 250, 375],
          },
          {
            if: "paymentType() == onetime && purpose() == p20",
            then: [5, 10, 20],
          },
          {
            if: "paymentType() == onetime",
            then: [60, 120, 250], // default for one-time donations
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
        translations: {
          de: {
            purposes: {
              p1: "Pro Juventute (DE)",
              p2: "Geburtstagskalender (2025)",                     // SD-17437
              p3: "SEA (Google Ads, 2025)",
              p4: "Medienkompetenz (DE)",
              p5: "Chesa (DE)",
              p6: "Für mehr Geborgenheit",
              p7: "Emika Türhänger (DE, 2024)",                     // SD-12555
              p8: "E-Mail Signatur",
              p9: "Adventkalender (2024)",                          // SD-14716
              p10: "Ostern - Landingpage Hase (2025)",              // SD-16430
              p11: "Ostern - Landingpage Maus (2025)",              // SD-16430
              p12: "Herbst - Haupt-LP (2025)",                      // SD-18794
              p13: "Ostern - Bestellbestätigung Hase (2025)",       // SD-16430
              p14: "Weihnachtsmailing (DE-FR-IT, 2023)",
              p15: "Digitale Begleitung August-Mailing (2025)",     // SD-18099
              p16: "Digitale Begleitung November-Mailing (2024)",   // SD-13753 + SD-14721
              p17: "Weltkindertag (DE, 2023)",
              p18: "Winterkampagne (DE)",
              p19: "Herbst - KMU-LP (2025)",                        // SD-18794
              p20: "Parkplatz",
              // note: RaiseNow allows max. 20 different purposes
            },
          },
        },
      });

      // switch campaign according to payment method selected
      window.rnw.tamaro.events.paymentMethodChanged.subscribe(function (event) {
        switch (event.data.api.paymentForm.data.payment_method) {
          case "paypal":  // Paypal - replacing "pp" since tamaro v2.8.3
          case "pp":      // Paypal
            switch (event.data.api.paymentForm.data.purpose) {
              default:
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FKzUQAW";
                break;
              case "p4":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FKzuQAG";
                break;
              case "p5":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FL0zQAG";
                break;
              case "p6":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj000004uQTmIAM";
                break;
              case "p7":
                switch(event.data.api.paymentForm.data.payment_type) {
                  case "onetime":
                  default:
                    event.data.api.paymentForm.data.stored_campaign_id =
                      "701Vj000006ZNYCIA4";
                    break;
                  case "recurring":
                    event.data.api.paymentForm.data.stored_campaign_id =
                      "701Vj000007BNWjIAO";
                    break;
                }
                break;
              case "p14":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000001pP2bQAE";
                break;
              case "p17":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000001pP0vQAE";
                break;
              case "p18":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FLA0QAO";
                break;
              case "p20":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002CkSXQA0";
                break;
              // note: RaiseNow allows max. 20 different purposes
            }
            break;
          case "chqr":            // QR Rechnung
          case "dd":              // Lastschriftverfahren / Direct Debit
//        case 'ezs':             // Einzahlungsschein
          case "qr-bill":         // QR Rechnung
          case "ch_qr_reference": // QR Rechnung (SD-18716)
            switch (event.data.api.paymentForm.data.purpose) {
              case "p1":
              default:
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FKzZQAW";
                break;
              case "p2":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000OxcwJIAR";
                break;
              case "p3":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000NHXASIA5";
                break;
              case "p4":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FL03QAG";
                break;
              case "p5":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FL10QAG";
                break;
              case "p6":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj000004uK0CIAU";
                break;
              case "p7":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj000006YXpJIAW";
                break;
              case "p8":
                switch(event.data.api.paymentForm.data.payment_type) {
                  case "onetime":
                  default:
                    event.data.api.paymentForm.data.stored_campaign_id =
                      "701Vj00000CfjH6IAJ";
                    break;
                  case "recurring":
                    event.data.api.paymentForm.data.stored_campaign_id =
                      "7013X000002FKzZQAW";
                    break;
                }
                break;
              case "p9":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000GK5iNIAT";
                break;
              case "p10":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000KXGLsIAP";
                break;
              case "p11":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000KXM34IAH";
                break;
              case "p12":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000TGKOkIAP";
                break;
              case "p13":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000KgaV6IAJ";
                break;
              case "p14":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000001pP2WQAU";
                break;
              case "p15":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000RkmLSIAZ";
                break;
              case "p16":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000GK7qaIAD";
                break;
              case "p17":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000001pP0uQAE";
                break;
              case "p18":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FLA5QAO";
                break;
              case "p19":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000TVCH7IAP";
                break;
              case "p20":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002CkSSQA0";
                break;
              // note: RaiseNow allows max. 20 different purposes
            }
            break;
          case "twint":   // Twint - cf. SD-11883
          case "twi":     // Twint
          case "card":    // Kreditkarte - replacing "vis" and "eca" since tamaro v2.8.3
          case "vis":     // Kreditkarte - Visa
          case "eca":     // Kreditkarte - Mastercard
          case "pfc":     // Postfinance
          default:
            switch (event.data.api.paymentForm.data.purpose) {
              case "p1":
              default:
                switch(event.data.api.paymentForm.data.payment_type) {
                  case "onetime":
                  default:
                    event.data.api.paymentForm.data.stored_campaign_id =
                      "7013X000002FKzKQAW";
                    break;
                  case "recurring":
                    event.data.api.paymentForm.data.stored_campaign_id =
                      "701Vj00000BZZB5IAP";
                    break;
                }
                break;
              case "p2":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000OxdfRIAR";
                break;
              case "p3":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000NHbdqIAD";
                break;
              case "p4":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FKztQAG";
                break;
              case "p5":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FL0vQAG";
                break;
              case "p6":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj000004uOGkIAM";
                break;
              case "p7":
                switch(event.data.api.paymentForm.data.payment_type) {
                  case "onetime":
                  default:
                    event.data.api.paymentForm.data.stored_campaign_id =
                      "701Vj000006ZLMLIA4";
                    break;
                  case "recurring":
                    event.data.api.paymentForm.data.stored_campaign_id =
                      "701Vj000007BOB4IAO";
                    break;
                }
                break;
              case "p8":
                switch(event.data.api.paymentForm.data.payment_type) {
                  case "onetime":
                  default:
                    event.data.api.paymentForm.data.stored_campaign_id =
                      "701Vj00000CfiB4IAJ";
                    break;
                  case "recurring":
                    event.data.api.paymentForm.data.stored_campaign_id =
                      "701Vj00000BZZB5IAP";
                    break;
                }
                break;
              case "p9":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000GK24hIAD";
                break;
              case "p10":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000KXKA8IAP";
                break;
              case "p11":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000KXEf3IAH";
                break;
              case "p12":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000TGJfdIAH";
                break;
              case "p13":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000KgbsWIAR";
                break;
              case "p14":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000001pP2gQAE";
                break;
              case "p15":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000RknsbIAB";
                break;
              case "p16":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000GKFPtIAP";
                break;
              case "p17":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000001pP0zQAE";
                break;
              case "p18":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FL9qQAG";
                break;
              case "p19":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "701Vj00000TV0FzIAL";
                break;
              case "p20":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002CkSNQA0";
                break;
              // note: RaiseNow allows max. 20 different purposes
            }
            break;
        }
      });

      /*
         // trigger tracking (GTM) event on load
         window.rnw.tamaro.events.afterRender.subscribe(function (event) {
            try {
               window.dataLayer.push({
                  'event': 'raiseNow-afterRender'
                  , 'event_data_api_configEnv': event.data.api.configEnv
                  // , 'event_data_api_paymentForm': event.data.api.paymentForm
               });
            } catch (err) {
               window.console.log('[raiseNow customEventHandler afterRender] error:');
               windowconsole.error(err);
            }
         });
         */

      // trigger tracking (GTM) event on completion
      if (typeof window.dataLayer === "object") {
        // agnosticalyze isnt availabe
        window.rnw.tamaro.events.paymentComplete.subscribe(function (event) {
          try {
            window.dataLayer.push({
              event: "raiseNow-paymentComplete",
              event_data_api_configEnv_widget: event.data.api.configEnv.WIDGET_UUID,
              event_data_api_configEnv_build: event.data.api.configEnv.BUILD_DATE,
              // , 'event_data_api_paymentForm': event.data.api.paymentForm
              event_data_api_transactionInfo_amount: event.data.api.transactionInfo.amount,
              event_data_api_transactionInfo_epaymentStatus: event.data.api.transactionInfo.epayment_status,
              event_data_api_transactionInfo_paymentMethod: event.data.api.transactionInfo.payment_method,
              event_data_api_transactionInfo_purposeId: event.data.api.transactionInfo.stored_rnw_purpose_id,
              event_data_api_transactionInfo_transactionId: event.data.api.transactionInfo.epp_transaction_id,
              event_data_api_customer_email: event.data.api.transactionInfo.stored_customer_email
            });
          } catch (err) {
            window.console.log(
              "[raiseNow customEventHandler paymentComplete] error:"
            );
            windowconsole.error(err);
          }
        });
      }
    }
  } else if (intervalCounterForRnw >= secondsToWaitForRnw * 2) {
    // after X * 2 tries = X seconds, stop the loop
    clearInterval(intervalLoopForRnw);
    window.console.log(
      "[raiseNow widget core] -> warning: waited too long, widget core not ready"
    );
  } else {
    window.console.log(
      "[raiseNow widget core] -> info: widget core not ready, trying again in 0.5 seconds..."
    );
    intervalCounterForRnw++;
  }
}, 500);

// window.console.log('     widget config complete');
