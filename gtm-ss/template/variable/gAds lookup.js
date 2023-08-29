// Enter your template code here.
const createRegex = require('createRegex');
const makeInteger = require('makeInteger');
const testRegex = require('testRegex');

if (data.grantsOrPaid === 'grants') {
  if (data.idOrLabel === 'id') {
    return '950649035';
  } else if (data.idOrLabel === 'label') {
    if (makeInteger(data.eventTimestamp) - makeInteger(data.sessionStartTimestamp) >= 30000 &&
        typeof data.cookieSessionPast30Seconds === 'undefined') {
      return 'omy6CKiUjs8YEMuBp8UD';  // 30_seconds_on_page
    } else if (data.eventName === 'scroll_percent_90' &&
               data.eventCategory === 'scrollDepth') {
      return 'D5TJCN2vj88YEMuBp8UD';  // scroll_90%
    } else if (data.eventName === 'start' &&
               data.eventCategory === 'video') {
      return 'vrk1COCvj88YEMuBp8UD';  // video_start
    } else if (data.eventName === 'complete' &&
               data.eventCategory === 'video') {
      return '9VYXCOOvj88YEMuBp8UD';  // video_complete
    } else if (data.eventCategory === 'user-interaction' &&
               testRegex(createRegex('147\\.ch', 'i'), data.pageHostname) &&
               testRegex(createRegex('(de|fr|it)\\/(dein-kontakt-zu-uns|nous-contacter|il-tuo-contatto-con-noi)\\/chat\\/chat', 'i'), data.pagePath) &&
               testRegex(createRegex('Chat beginnen|Commencer le chat|Avviare la chat', 'i'), data.eventLabel)) {
      return 'o9RZCOavj88YEMuBp8UD';  // kontakt_147_chat
    } else if (data.eventCategory === 'user-interaction' &&
               testRegex(createRegex('147\\.ch', 'i'), data.pageHostname) &&
               testRegex(createRegex('(counseling|conseils|consiglio)\\/peer-chat', 'i'), data.pagePath) &&
               testRegex(createRegex('Chatten|Chatter|Chat', 'i'), data.eventLabel)) {
      return 'B3H_COmvj88YEMuBp8UD';  // kontakt_147_peer-chat
    } else if (data.eventName === 'link_click' &&
               testRegex(createRegex('147\\.ch', 'i'), data.pageHostname) &&
               data.targetProtocol === 'tel:') {
      return 'IAgMCOyvj88YEMuBp8UD';  // kontakt_147_anruf
    } else if (data.eventName === 'link_click' &&
               testRegex(createRegex('147\\.ch', 'i'), data.pageHostname) &&
               data.targetProtocol === 'sms:') {
      return 'xrRECO-vj88YEMuBp8UD';  // kontakt_147_sms
    } else if (data.eventName === 'link_click' &&
               testRegex(createRegex('147\\.ch', 'i'), data.pageHostname) &&
               data.targetProtocol === 'mailto:') {
      return 'ysXwCPKvj88YEMuBp8UD';  // kontakt_147_email
// TBD: kontakt_proju_chat: Montag bis Freitag 08:30 – 11:30
    } else if (data.eventName === 'link_click' &&
               testRegex(createRegex('projuventute\\.ch', 'i'), data.pageHostname) &&
               data.targetProtocol === 'tel:') {
      return 'fFlYCPivj88YEMuBp8UD';  // kontakt_proju_anruf
    } else if (data.eventName === 'link_click' &&
               testRegex(createRegex('projuventute\\.ch', 'i'), data.pageHostname) &&
               data.targetProtocol === 'mailto:') {
      return 'WmP9CPuvj88YEMuBp8UD';  // kontakt_proju_email
    } else if (data.eventName === 'focus_form' &&
               data.formElementType === 'submit' &&
               testRegex(createRegex('veranstaltung', 'i'), data.formId)) {
      return '_DxrCP6vj88YEMuBp8UD';  // anmeldung_veranstaltung
    } else if (data.eventName === 'submit_form' &&
               data.pageHostname === 'cloud.go.projuventute.ch' &&
               data.pagePath === '/newsletter') {
      return 'QPl7CK3Qj88YEMuBp8UD';  // newsletter_anmeldung
    } else if (data.eventName === 'abgeschlossen' &&
               data.eventCategory === 'spende') {
      return 'ICqoCKjRj88YEMuBp8UD';  // spende
    } else if (data.eventName === 'site_search' &&
               testRegex(createRegex('147\\.ch', 'i'), data.pageHostname)) {
      return 'ELWtCKvRj88YEMuBp8UD';  // suche_147
    } else if (data.eventName === 'site_search' &&
               testRegex(createRegex('projuventute\\.ch', 'i'), data.pageHostname)) {
      return 'vUNcCK7Rj88YEMuBp8UD';  // suche_proju
    } else if (data.eventName === 'page_view' &&
               data.pageHostname === 'elternbriefe.projuventute.ch' &&
               testRegex(createRegex('.*onboarding\\/.*thank-you', 'i'), data.pagePath)) {
      return 'zL4pCLHRj88YEMuBp8UD';  // elternbrief_bestellt
    } else if (data.eventName === 'play' &&
               data.eventCategory === 'audioPlayer') {
      return 'In7xCLTRj88YEMuBp8UD';  // podcast_start
    } else if (data.eventName === 'finished' &&
               data.eventCategory === 'audioPlayer') {
      return 'C6_ECLfRj88YEMuBp8UD';  // podcast_complete
    } else if (data.eventCategory === 'user-interaction' &&
               testRegex(createRegex('147\\.ch', 'i'), data.pageHostname)
               // TBD: button ID
               ) {
      return 'EjsaCLrRj88YEMuBp8UD';  // like_147
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
} else if (data.grantsOrPaid === 'paid') {
  if (data.idOrLabel === 'id') {
    return '1012309629';
  } else if (data.idOrLabel === 'label') {
    return 4; // TBD
  } else {
    return undefined;
  }
} else {
  return undefined;
}
