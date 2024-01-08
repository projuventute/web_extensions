function Popup(site, geo) {
  let linkTitel =
    geo === "DE"
      ? "Anlaufstellen in Ihrem Land"
      : geo === "AT"
      ? "Anlaufstellen in Ihrem Land"
      : geo === "FR"
      ? site === "147"
        ? "Ressources dans ton pays"
        : "Ressources dans votre pays"
      : geo === "IT"
      ? "Per conoscere a chi rivolgersi nel tuo Paese"
      : "";
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
          { titel: "119", link: "https://www.allo119.gouv.fr/" },
          {
            titel: "En cas d’idées suicidaires, appelle le 3114",
            link: "https://3114.fr/",
          },
          {
            titel: "Les lignes d’écoute – Psycom – Santé Mentale Info",
            link: "https://www.psycom.org/sorienter/les-lignes-decoute/",
          },
          {
            titel: "Soutenir la parentalité",
            link: "https://solidarites.gouv.fr/soutenir-la-parentalite",
          },
        ]
      : geo === "IT"
      ? [
          {
            titel: "Telefono Azzurro (19696 - linea di ascolto 24h su 24)",
            link: "https://www.azzurro.it/",
          },
          {
            titel: "Telefono Amico (02 2327 2327)",
            link: "tel:0223272327",
          },
          {
            titel: "Telefono Amico WhatsApp (324 011 7252)",
            link: "https://wa.link/ug93ne",
          },
          {
            titel: "114 (numero per le emergenze gestito dal Telefono Azzurro",
            link: "tel:114",
          },
          {
            titel: "116 000 (numero unico europeo per minori scomparsi",
            link: "tel:116000",
          },
        ]
      : [];

  let land =
    geo === "DE"
      ? "Deutschland"
      : geo === "AT"
      ? "Österreich"
      : geo === "FR"
      ? "France"
      : geo === "IT"
      ? "Italia"
      : "";
  const greeting =
    geo === "DE"
      ? "Hallo"
      : geo === "AT"
      ? "Hallo"
      : geo === "FR"
      ? "Bonjour"
      : geo === "IT"
      ? "Ciao"
      : "";
  const geoTextDe =
    site === "147"
      ? `Es sieht so aus als würdest du aus ${land} auf 147.ch zugreifen.`
      : `Es sieht so aus als würden Sie aus ${land} auf projuventute.ch zugreifen.`;
  const infoTextDe =
    site === "147"
      ? `Leider ist unser Beratungsangebot ausschließlich für Kinder und Jugendliche aus der Schweiz und Fürstentum Liechtenstein verfügbar.`
      : `Leider ist unser Beratungsangebot ausschließlich für Eltern und Bezugspersonen von Kindern und Jugendliche aus der Schweiz und Fürstentum Liechtenstein verfügbar.`;
  const geoTextFr =
    site === "147"
      ? `Il semblerait que tu contactes le 147.ch depuis la ${land}`
      : `Il semblerait que vous nous contactiez depuis la ${land}`;
  const infoTextFr =
    site === "147"
      ? `Notre service de conseil n’est destiné qu’aux enfants et aux jeunes qui vivent en Suisse.`
      : `Notre service de conseils aux parents est destiné exclusivement aux familles qui vivent en Suisse et au Lichtenstein. `;
  const geoTextIt =
    site === "147"
      ? `Sembra che tu stia accedendo a 147.ch dall'${land}. `
      : `Sembra che lei stia accedendo a projuventute.ch dall'${land}.`;
  const infoTextIt =
    site === "147"
      ? `Purtroppo il nostro servizio di consulenza è disponibile solo per i bambini e i giovani svizzeri. `
      : `Purtroppo il nostro servizio di consulenza è disponibile solo per i genitori e chi si occupa di bambini e adolescenti della Svizzera. `;

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
  const weiterText =
    geo === "DE"
      ? "Weiter zu"
      : geo === "AT"
      ? "Weiter zu"
      : geo === "FR"
      ? "Continuer sur le"
      : geo === "IT"
      ? "Vada su"
      : "";

  let linksHtml = "";
  for (let i = 0; i < links.length; i++) {
    linksHtml += `<div style="display:flex"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M7 12H17" stroke="#CD679D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> <path d="M13 8L17 12L13 16" stroke="#CD679D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </svg> <a href="${links[i].link}" target="_blank" style="color:black">${links[i].titel}</a></div>`;
  }
  let html = `<div id="geo-popup-pj" style="display: block; position: fixed;z-index:10001; top:0; width: 95%; min-width: 320px; max-width: 650px; background-color: white; padding: 40px; font-family: Montserrat, Arial, Helvetica, sans-serif; left: 50%; top: 50%; transform: translate(-50%, -50%); " > <h2 style="font-size: 56px">${greeting}</h2> <p>${geoText}</p><p>${infoText}</p><h3 style="font-size: 24px">${linkTitel}</h3>
  ${linksHtml}
  <div style="margin-top: 40px; border-bottom: 1px solid #CD679D; display: inline-block; cursor:pointer;" onClick="closePopup()">${weiterText} ${" "} ${
    site === "147" ? "147.ch" : "projuventute.ch"
  }</div> </div>
  <div id="geo-popup-pj-overlay" style="display: block;top:0; position:fixed;width:100%;height:100%;background-color:rgba(0,0,0,0.7);z-index:10000;" onClick="closePopup()"></div>
  `;
  document.body.innerHTML += html;
}

// weiterText + " " + site === "147" ? "147.ch" : "projuventute.ch"

// to do: closePopup()
function closePopup() {
  document.getElementById("geo-popup-pj").style.display = "none";
  document.getElementById("geo-popup-pj-overlay").style.display = "none";
}

//Popup("projuventute", "IT");
