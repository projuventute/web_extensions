function Popup(site, geo) {
  let links =
    geo === "DE"
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
      : geo === "AT"
      ? [
          {
            titel: "147 Rat auf Draht - Notrufnummer & Beratung",
            link: "https://www.rataufdraht.at/",
          },
        ]
      : geo === "FR"
      ? [
          {
            titel: "Les lignes d’écoute – Psycom – Santé Mentale Info",
            link: "https://www.psycom.org/sorienter/les-lignes-decoute/",
          },
        ]
      : [];

  let land =
    geo === "DE"
      ? "Deutschland"
      : geo === "AT"
      ? "Österreich"
      : geo === "FR"
      ? "Frankreich"
      : geo === "IT"
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
  const infoTextFr = site === "147" ? `` : ``;
  const geoTextIt = site === "147" ? `` : ``;
  const infoTextIt = site === "147" ? `` : ``;

  const geoText =
    geo === "DE"
      ? geoTextDe
      : geo === "AT"
      ? geoTextDe
      : geo === "FR"
      ? geoTextFr
      : geo === "IT"
      ? geoTextIt
      : "";
  const infoText =
    geo === "DE"
      ? infoTextDe
      : geo === "AT"
      ? infoTextDe
      : geo === "FR"
      ? infoTextFr
      : geo === "IT"
      ? infoTextIt
      : "";

  let linksHtml = "";
  for (let i = 0; i < links.length; i++) {
    linksHtml += `<div style="display:flex"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M7 12H17" stroke="#CD679D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> <path d="M13 8L17 12L13 16" stroke="#CD679D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </svg> <a href="${links[i].link}" target="_blank" style="color:black">${links[i].titel}</a></div>`;
  }
  let html = `<div id="geo-popup-pj" style="position: fixed;z-index:10001;width: 95%; min-width: 320px; max-width: 650px; background-color: white; padding: 40px; font-family: Montserrat, Arial, Helvetica, sans-serif; left: 50%; top: 50%; transform: translate(-50%, -50%); " > <h2 style="font-size: 56px">Hallo</h2> <p>${geoText}</p><p>${infoText}</p><h3 style="font-size: 24px">Anlaufstellen in deinem Land</h3>
  ${linksHtml}
  <div style="margin-top: 40px; border-bottom: 1px solid #CD679D; display: inline-block; cursor:pointer;" onClick="closePopup()">Weiter zu 147.ch</div> </div>
  <div style="position:fixed;width:100%;height:100%;background-color:rgba(255,255,255,0.6);z-index:10000;"></div>
  `;
  document.body.innerHTML += html;
}

Popup("147", "DE");
