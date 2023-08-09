function Popup(site, geo, links) {
    // to do
    // geo = FR, dann übersetzen zu "Frankreich" innerhalb der Funktion
    // langauge == geo
  let linksHtml = "";
  for (let i = 0; i < links.length; i++) {
    linksHtml += `<div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M7 12H17" stroke="#CD679D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> <path d="M13 8L17 12L13 16" stroke="#CD679D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </svg> <a href="${links[i].link}" target="_blank" style="color:black">${links[i].titel}</a></div>`;
  }
  let html = `<div id="geo-popup-pj" style="position: fixed;width: 95%; min-width: 320px; max-width: 650px; background-color: white; padding: 40px; font-family: Montserrat, Arial, Helvetica, sans-serif; left: 50%; top: 50%; transform: translate(-50%, -50%); " > <h2 style="font-size: 56px">Hallo</h2> <p> Es sieht so aus als würdest du aus 
  ${geo} 
  auf 147.ch zugreifen. </p> <p> Unser Beratungsangebot steht leider nur für Kinder und Jugendliche in der Schweiz zur Verfügung. </p> <h3 style="font-size: 24px">Anlaufstellen in deinem Land</h3>
  ${linksHtml}
  <div style="margin-top: 40px">Weiter zu 147.ch</div> </div>
  `;
  document.body.innerHTML += html;
}

/*
Popup("147", "Frankreich", [
  {
    titel: "147 - Beratung für Kinder und Jugendliche",
    link: "https://www.147.ch",
  },
  { titel: "Elternberatung", link: "https://www.projuventute.ch" },
]);
*/
