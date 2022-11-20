// determine language of widget
// get page language from meta tag - preferred over uri
const pageLang_meta = document.head.querySelector('meta[http-equiv="content-language"]').content;
if (typeof pageLang_meta === 'undefined' || pageLang_meta === '') {
   // get page language from uri
   if (window.location.href.match(/\/fr\//)) {
      const pageLang = 'fr';
   } else if (window.location.href.match(/\/it\//)) {
      const pageLang = 'it';
   } else if (window.location.href.match(/\/en\//)) {
      const pageLang = 'en';
   } else {
      const pageLang = 'de'; // practically defines the global fallback
   }
} else {
   const pageLang = pageLang_meta;
}

if (typeof window.rnw === 'object' && typeof window.rnw.tamaro === 'object') {
   // configure raiseNow widget
   window.rnw.tamaro.runWidget('.rnw-widget-container', {
      language: pageLang
      , amounts: [
         {
            "if": "paymentType() == onetime"
            , "then": [60,120,250]
            ,
         }
         , {
            "if": "paymentType() == recurring && recurringInterval() == monthly"
            , "then": [20,40,60]
            ,
         }
         , {
            "if": "paymentType() == recurring && recurringInterval() == quarterly"
            , "then": [60,140,200]
            ,
         }
         , {
            "if": "paymentType() == recurring && recurringInterval() == semestral"
            , "then": [120,180,300]
            ,
         }
         , {
            "if": "paymentType() == recurring && recurringInterval() == yearly"
            , "then": [240,480,600]
            ,
         }
      ]
      , defaultAmount: 120
      , translations: {
         de: {
            purposes: {
               p1: 'Pro Juventute (DE)'
               , p2: 'Pro Juventute (DE)'
               , p3: 'Pro Juventute (GA-DE)'
               , p4: 'Medienkompetenz (DE)'
               , p5: 'Chesa (DE)'
               , p6: 'Coronareport (DE)'
               , p7: 'Finanzkompetenz (DE)'
               , p8: 'wup (DE)'
               , p9: 'Future Skills (DE)'
               , p10: 'Ferienpass (DE)'
               , p11: 'Newsletter (DE)'
               , p12: 'Jugendappell (DE)'
               , p13: 'Bewerbungstraining (DE)'
               , p14: 'Kultissimo (DE)'
               , p15: 'Stress-Studie (DE)'
               , p16: 'Pro Juventute (Lidl-DE)'
               , p17: 'Pro Juventute (Optic2000-DE)'
               , p18: 'Winterkampagne (DE)'
               , p19: 'Pro Juventute (Ich habe Angst)'
            }
         }
      }
   });

   // switch campaign according to payment method selected
   window.rnw.tamaro.events.paymentMethodChanged.subscribe(function(event) {
      switch(event.data.api.paymentForm.data.payment_method) {
         case 'twi':     // Twint
         case 'vis':     // Kreditkarte - Visa
         case 'eca':     // Kreditkarte - Mastercard
         case 'pfc':     // Postfinance
         default:
            switch (event.data.api.paymentForm.data.purpose) {
               case 'p1':
               case 'p2':
               case 'p3':
               case 'p6':
               case 'p11':
               case 'p12':
               case 'p15':
               case 'p16':
               default:
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FKzKQAW';
                  break;
               case 'p4':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FKztQAG';
                  break;
               case 'p5':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL0vQAG';
                  break;
               case 'p7':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLJqQAO';
                  break;
               case 'p9':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLAyQAO';
                  break;
               case 'p10':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL8TQAW';
                  break;
               case 'p13':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL8sQAG';
                  break;
               case 'p14':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL08QAG';
                  break;
               case 'p17':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLBIQA4';
                  break;
               case 'p18':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL9qQAG';
                  break;
               case 'p19':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FSyFQAW';
                  break;
            }
            break;	    
         case 'pp':      // Paypal
            switch (event.data.api.paymentForm.data.purpose) {
               case 'p1':
               case 'p2':
               case 'p3':
               case 'p6':
               case 'p11':
               case 'p12':
               case 'p15':
               case 'p16':
               default:
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FKzUQAW';
                  break;
               case 'p4':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FKzuQAG';
                  break;
               case 'p5':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL0zQAG';
                  break;
               case 'p7':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLK0QAO';
                  break;
               case 'p9':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLB8QAO';
                  break;
               case 'p10':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL8YQAW';
                  break;
               case 'p13':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL8qQAG';
                  break;
               case 'p14':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL0DQAW';
                  break;
               case 'p17':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLBJQA4';
                  break;
               case 'p18':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLA0QAO';
                  break;
               case 'p19':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FSyKQAW';
                  break;
            }
            break;
         case 'dd':        // Lastschriftverfahren / Direct Debit
         case 'ezs':       // Einzahlungsschein
         case 'qr-bill':   // QR Rechnung
            switch (event.data.api.paymentForm.data.purpose) {
               case 'p1':
               case 'p2':
               case 'p3':
               case 'p6':
               case 'p11':
               case 'p12':
               case 'p15':
               case 'p16':
               default:
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FKzZQAW';
                  break;
               case 'p4':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL03QAG';
                  break;
               case 'p5':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL10QAG';
                  break;
               case 'p7':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLK5QAO';
                  break;
               case 'p9':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLBDQA4';
                  break;
               case 'p10':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL8dQAG';
                  break;
               case 'p13':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL8xQAG';
                  break;
               case 'p14':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL0IQAW';
                  break;
               case 'p17':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLBNQA4';
                  break;
               case 'p18':
                  event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLA5QAO';
                  break;
               // case o19?
            }
            break;
      }
   });

   // trigger gtm event on completion
   // tbd
}
