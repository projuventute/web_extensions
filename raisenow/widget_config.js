// v1.8.4 - 2024-07-20

// window.console.log('[raiseNow widget config] start');

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

      // set default purpose and amount based on page uri
      // -> https://support.raisenow.com/hc/en-us/articles/360018786778-Adding-conditions-in-your-configuration
      var defaultPurp = "p1"; // declare and set default
      var defaultAmtOneTime = [60, 120, 250]; // declare and set default
      if (window.location.href.match(/.*\/de\/so-koennen-sie-helfen.*/)) {  // SD-12555
        defaultPurp = "p7";
      } else if (window.location.href.match(/.*\/(weltkindertag|de\/node\/1357).*/)) {
        defaultPurp = "p17";
        defaultAmtOneTime = [60, 120, 240];
      } else if (window.location.href.match(/.*\/(de\/danke|fr\/merci|it\/grazie).*/)) {
        defaultPurp = "p14";
        defaultAmtOneTime = [45, 90, 150];
      } else if (window.location.href.match(/.*\/luca-leidet-still.*/)) {
        defaultPurp = "p19";
        defaultAmtOneTime = [45, 75, 120];
      } else if (window.location.href.match(/.*\/meine-spende-rettet-leben.*|.*\/mon-don-sauve-des-vies.*|.*\/la-mia-donazione-salva-delle-vite.*/)) {
      } else if (window.location.href.match(/.*\/meine-spende-rettet-leben.*|.*\/mon-don-sauve-des-vies.*|.*\/la-mia-donazione-salva-delle-vite.*/)) {
        defaultPurp = "p18";
      } else {
        defaultPurp = "p1";
        defaultAmtOneTime = [60, 120, 250];
      }

      // configure raiseNow widget
      window.rnw.tamaro.runWidget(".rnw-widget-container", {
        language: pageLang,
        defaultPurpose: defaultPurp,
        amounts: [
          {
            if: "paymentType() == onetime && purpose() == p20",
            then: [5, 10, 20],
          },
          {
            if: "paymentType() == onetime",
            then: defaultAmtOneTime,
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
        defaultAmount: 120,
        translations: {
          de: {
            purposes: {
              p1: "Pro Juventute (DE)",
              p2: "Pro Juventute (DE)",
              p3: "Pro Juventute (GA-DE)",
              p4: "Medienkompetenz (DE)",
              p5: "Chesa (DE)",
              p6: "Für mehr Geborgenheit",
              p7: "Emika Türhänger (DE, 2024)",       // SD-12555
              p8: "wup (DE)",
              p9: "Future Skills (DE)",
              p10: "Ferienpass (DE)",
              p11: "Newsletter (DE)",
              p12: "Jugendappell (DE)",
              p13: "Bewerbungstraining (DE)",
              p14: "Weihnachtsmailing (DE-FR-IT, 2023)",
              p15: "Stress-Studie (DE)",
              p16: "Pro Juventute (Lidl-DE)",
              p17: "Weltkindertag (DE, 2023)",
              p18: "Winterkampagne (DE)",
              p19: "Luca leidet still (DE, 2023)",
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
              case "p1":
              case "p2":
              case "p3":
              case "p11":
              case "p12":
              case "p15":
              case "p16":
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
              case "p9":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FLB8QAO";
                break;
              case "p10":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FL8YQAW";
                break;
              case "p13":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FL8qQAG";
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
              case "p19":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X00000290OCQAY";
                break;
              case "p20":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002CkSXQA0";
                break;
              // note: RaiseNow allows max. 20 different purposes
            }
            break;
          case "dd":      // Lastschriftverfahren / Direct Debit
//        case 'ezs':     // Einzahlungsschein
          case "qr-bill": // QR Rechnung
            switch (event.data.api.paymentForm.data.purpose) {
              case "p1":
              case "p2":
              case "p3":
              case "p11":
              case "p12":
              case "p15":
              case "p16":
              default:
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FKzZQAW";
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
              case "p9":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FLBDQA4";
                break;
              case "p10":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FL8dQAG";
                break;
              case "p13":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FL8xQAG";
                break;
              case "p14":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000001pP2WQAU";
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
                  "7013X00000290O7QAI";
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
              case "p2":
              case "p3":
              case "p11":
              case "p12":
              case "p15":
              case "p16":
              default:
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FKzKQAW";
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
              case "p9":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FLAyQAO";
                break;
              case "p10":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FL8TQAW";
                break;
              case "p13":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000002FL8sQAG";
                break;
              case "p14":
                event.data.api.paymentForm.data.stored_campaign_id =
                  "7013X000001pP2gQAE";
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
                  "7013X00000290OHQAY";
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
      if (typeof window.TMSProcessing === "object") {
        // agnosticalyze is availabe
        window.rnw.tamaro.events.paymentComplete.subscribe(function (event) {
          try {
            // set secondsToWait to 15 seconds
            var secondsToWait = 15;

            var intervalCounter = 1;
            intervalLoop = setInterval(function () {
              if (
                typeof window.TMSEvent === "undefined" ||
                Object.keys(window.TMSEvent).length === 0
              ) {
                // TMSEvent is deleted or empty
                clearInterval(intervalLoop);
                window.TMSHelper.console(
                  "[raiseNow customEventHandler paymentComplete] -> info: triggering DICE"
                );
                event_data = {};
                event_data["event_eventInfo_type"] = "raiseNow-paymentComplete";
                event_data["event_processing_trigger"] =
                  "raiseNow-customEventHandler";
                event_data["event_data_api_configEnv"] =
                  event.data.api.configEnv;
                // event_data['event_data_api_paymentForm'] = event.data.api.paymentForm;
                event_data["event_data_api_transactionInfo_amount"] =
                  event.data.api.transactionInfo("amount");
                event_data["event_data_api_transactionInfo_transactionId"] =
                  event.data.api.transactionInfo("transaction_id");
                event_data["event_data_api_transactionInfo_transactionStatus"] =
                    event.data.api.transactionInfo("epayment_status");                
                // trigger DICE
                window.TMSProcessing.dice(event_data);
              } else if (intervalCounter >= secondsToWait * 2) {
                // after X * 2 tries = X seconds, stop the loop
                clearInterval(intervalLoop);
                window.TMSHelper.console(
                  "[raiseNow customEventHandler paymentComplete] -> warning: waited too long, DICE not triggered"
                );
              } else {
                window.TMSHelper.console(
                  "[raiseNow customEventHandler paymentComplete] -> info: TMSEvent not ready, trying again in 0.5 seconds..."
                );
                intervalCounter++;
              }
            }, 500);
          } catch (err) {
            window.TMSHelper.console(
              "[raiseNow customEventHandler paymentComplete] error:"
            );
            window.TMSHelper.errorHandler(err);
          }
        });
      } else if (typeof window.dataLayer === "object") {
        // agnosticalyze isnt availabe
        window.rnw.tamaro.events.paymentComplete.subscribe(function (event) {
          try {
            window.dataLayer.push({
              event: "raiseNow-paymentComplete",
              event_data_api_configEnv: event.data.api.configEnv,
              // , 'event_data_api_paymentForm': event.data.api.paymentForm
              event_data_api_transactionInfo_amount: event.data.api.transactionInfo("amount"),
              event_data_api_transactionInfo_transactionId: event.data.api.transactionInfo("transaction_id"),
              event_data_api_transactionInfo_transactionStatus: event.data.api.transactionInfo("epayment_status"),
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
