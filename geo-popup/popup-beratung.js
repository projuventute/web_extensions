function Popup(site, geo) {
  // to do
  // geo = FR, dann übersetzen zu "Frankreich" innerhalb der Funktion
  // langauge == geo

  let links = geo === "DE"
    ? [
        {
          titel: "krisenchat | 24/7 Krisenberatung per Chat",
          link: "https://krisenchat.de/",
        },
        {
          titel:
            "Kostenfreie Beratung für Eltern, Kinder und Jugendliche (nummergegenkummer.de)",
          link: "https://www.nummergegenkummer.de/",
        },
      ]
    : "AT"
    ? [
        {
          titel: "147 Rat auf Draht - Notrufnummer & Beratung",
          link: "https://www.rataufdraht.at/",
        },
      ]
    : [];

  let land =
    geo === "DE"
      ? "Deutschland"
      : "AT"
      ? "Österreich"
      : "FR"
      ? "Frankreich"
      : "IT"
      ? "Italia"
      : "";
  const geoTextDe =
    site === "147"
      ? `Es sieht so aus als würdest du aus ${land} auf 147.ch zugreifen.`
      : `Es sieht so aus als würden Sie aus ${land} auf projuventute.ch zugreifen.`;
  const infoTextDe =
    site === "147"
      ? `Leider ist unser Beratungsangebot ausschließlich für Kinder und Jugendliche aus der Schweiz verfügbar.`
      : `Leider ist unser Beratungsangebot ausschließlich für Eltern und Bezugspersonen von Kindern und Jugendliche aus der Schweiz verfügbar.`;
  const geoTextFr = site === "147" ? `` : ``;
  const geoTextIt = site === "147" ? `` : ``;

  const geoText =
    geo === "DE"
      ? geoTextDe
      : "AT"
      ? geoTextDe
      : "FR"
      ? geoTextFr
      : "IT"
      ? geoTextIt
      : "";
  const infoText =
    geo === "DE"
      ? infoTextDe
      : "AT"
      ? infoTextDe
      : "FR"
      ? infoTextFr
      : "IT"
      ? infoTextIt
      : "";

  let linksHtml = "";
  for (let i = 0; i < links.length; i++) {
    linksHtml += `<div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M7 12H17" stroke="#CD679D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> <path d="M13 8L17 12L13 16" stroke="#CD679D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </svg> <a href="${links[i].link}" target="_blank" style="color:black">${links[i].titel}</a></div>`;
  }
  let html = `<div id="geo-popup-pj" style="position: fixed;width: 95%; min-width: 320px; max-width: 650px; background-color: white; padding: 40px; font-family: Montserrat, Arial, Helvetica, sans-serif; left: 50%; top: 50%; transform: translate(-50%, -50%); " > <h2 style="font-size: 56px">Hallo</h2> <p>${geoText}</p><p>${infoText}</p><h3 style="font-size: 24px">Anlaufstellen in deinem Land</h3>
  ${linksHtml}
  <div style="margin-top: 40px">Weiter zu 147.ch</div> </div>
  `;
  document.body.innerHTML += html;
}

// function getCookie(name) {
//   var dc = document.cookie;
//   var prefix = name + "=";
//   var begin = dc.indexOf("; " + prefix);
//   if (begin == -1) {
//       begin = dc.indexOf(prefix);
//       if (begin != 0) return null;
//   }
//   else
//   {
//       begin += 2;
//       var end = document.cookie.indexOf(";", begin);
//       if (end == -1) {
//       end = dc.length;
//       }
//   }
//   return decodeURI(dc.substring(begin + prefix.length, end));
// } 

// function doSomething() {
//   var myCookie = getCookie("MyCookie");

//   if (myCookie == null) {
//     // cookie gibts nicht
//   }
//   else {
//       // cookie gibts
//       console.log("myCookie ", myCookie)
//   }
// }

// Popup("147", "AT");
