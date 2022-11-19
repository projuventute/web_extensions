// 1 determine language of widget
// 1.1 get page language from meta tag
const pageLang_meta = document.head.querySelector('meta[http-equiv="content-language"]').content;
if (typeof pageLang_meta === 'undefined' || pageLang_meta === '') {
   // 1.2 get page language from uri
   if (window.location.href.match(/\/fr\//)) {
      const pageLang = 'fr';
   } else if (window.location.href.match(/\/it\//)) {
      const pageLang = 'it';
   } else if (window.location.href.match(/\/en\//)) {
      const pageLang = 'en';
   } else {
      const pageLang = 'de'; // precatically defines the global fallback
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
         case 'twi':     //Twint
         case 'vis':     //Kreditkarte - Visa
         case 'eca':     //Kreditkarte - Mastercard
         case 'pfc':     //Postfinance
            if (event.data.api.paymentForm.data.purpose == 'p1'||'p2'||'p3'||'p6'||'p11'||'p12'||'p15'||'p16') {
               event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FKzKQAW';}
            if (event.data.api.paymentForm.data.purpose == 'p4') {
               event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FKztQAG';}
            if (event.data.api.paymentForm.data.purpose == 'p5') {
               event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL0vQAG';}
            if (event.data.api.paymentForm.data.purpose == 'p7') {
               event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLJqQAO';}            
            if (event.data.api.paymentForm.data.purpose == 'p9') {
               event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLAyQAO';}            
            if (event.data.api.paymentForm.data.purpose == 'p10') {
               event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL8TQAW';}
            if (event.data.api.paymentForm.data.purpose == 'p13') {
               event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL8sQAG';} 
            if (event.data.api.paymentForm.data.purpose == 'p14') {
               event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL08QAG';}               
            if (event.data.api.paymentForm.data.purpose == 'p17') {
               event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLBIQA4';}
            if (event.data.api.paymentForm.data.purpose == 'p18') {
               event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL9qQAG';} 
            if (event.data.api.paymentForm.data.purpose == 'p19') {
               event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FSyFQAW';} 
            
            break;	    
          case 'pp':      //Paypal
              if(event.data.api.paymentForm.data.purpose == 'p1'||'p2'||'p3'||'p6'||'p11'||'p12'||'15'||'p16'){
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FKzUQAW';}
              if(event.data.api.paymentForm.data.purpose == 'p4') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FKzuQAG';}
              if(event.data.api.paymentForm.data.purpose == 'p5') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL0zQAG';}
              if(event.data.api.paymentForm.data.purpose == 'p7') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLK0QAO';}            
              if(event.data.api.paymentForm.data.purpose == 'p9') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLB8QAO';}            
              if(event.data.api.paymentForm.data.purpose == 'p10') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL8YQAW';}
              if(event.data.api.paymentForm.data.purpose == 'p13') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL8qQAG';}
              if(event.data.api.paymentForm.data.purpose == 'p14') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL0DQAW';}               
              if(event.data.api.paymentForm.data.purpose == 'p17') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLBJQA4';} 
    if(event.data.api.paymentForm.data.purpose == 'p19') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FSyKQAW';} 
    if(event.data.api.paymentForm.data.purpose == 'p18') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLA0QAO';} 
              break;
          case 'dd':      //Lastschriftverfahren / Direct Debit
              if(event.data.api.paymentForm.data.purpose == 'p1'||'p2'||'p3'||'p6'||'p11'||'p12'||'15'||'p16'){
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FKzZQAW';}
              if(event.data.api.paymentForm.data.purpose == 'p4') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL03QAG';}
              if(event.data.api.paymentForm.data.purpose == 'p5') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL10QAG';}
              if(event.data.api.paymentForm.data.purpose == 'p7') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLK5QAO';}            
              if(event.data.api.paymentForm.data.purpose == 'p9') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLBDQA4';}            
              if(event.data.api.paymentForm.data.purpose == 'p10') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL8dQAG';}
              if(event.data.api.paymentForm.data.purpose == 'p13') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL8xQAG';}
              if(event.data.api.paymentForm.data.purpose == 'p14') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL0IQAW';}               
              if(event.data.api.paymentForm.data.purpose == 'p17') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLBNQA4';} 
    if(event.data.api.paymentForm.data.purpose == 'p18') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLA5QAO';}
              break;
          case 'ezs':      //Einzahlungsschein
              if(event.data.api.paymentForm.data.purpose == 'p1'||'p2'||'p3'||'p6'||'p11'||'p12'||'15'||'p16'){
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FKzZQAW';}
              if(event.data.api.paymentForm.data.purpose == 'p4') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL03QAG';}
              if(event.data.api.paymentForm.data.purpose == 'p5') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL10QAG';}
              if(event.data.api.paymentForm.data.purpose == 'p7') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLK5QAO';}            
              if(event.data.api.paymentForm.data.purpose == 'p9') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLBDQA4';}            
              if(event.data.api.paymentForm.data.purpose == 'p10') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL8dQAG';}
              if(event.data.api.paymentForm.data.purpose == 'p13') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL8xQAG';}
              if(event.data.api.paymentForm.data.purpose == 'p14') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FL0IQAW';}               
              if(event.data.api.paymentForm.data.purpose == 'p17') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLBNQA4';} 
    if(event.data.api.paymentForm.data.purpose == 'p19') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FSyPQAW';} 
    if(event.data.api.paymentForm.data.purpose == 'p18') {
              event.data.api.paymentForm.data.stored_campaign_id = '7013X000002FLA5QAO';} 
              break;     
          }
        });
}

