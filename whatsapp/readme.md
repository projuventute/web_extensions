# Gesamtfunktionalität:

- Die Datei `manifest.json` der Erweiterung definiert ihre Metadaten, Berechtigungen und Inhalts-Scripts.
- `js/injectionHook.js` setzt Standardwerte, lädt Einstellungen und injiziert Skripte in Webseiten.
- `js/injected.js` überwacht Fetch-Anfragen, protokolliert Anfrage-/Antwortdetails und behandelt die Blockierung von Medien basierend auf den Benutzereinstellungen.
- `js/mediaBlock.js` modifiziert URLs von Medieninhalten für die Blockierung basierend auf dem Dateityp.
- `js/options.js` verwaltet Benutzereinstellungen, einschließlich deren Speicherung in der Chrome-Speicherung und Anzeige auf der Optionsseite.

## `manifest.json`

- `manifest_version`: Dieses Feld gibt die Version des verwendeten Manifestformats der Chrome-Erweiterung an (in diesem Fall Version 3).
- `name`: Der Name der Erweiterung, der den Benutzern im Chrome Web Store angezeigt wird.
- `author`: Der Autor oder die Organisation, die für die Erweiterung verantwortlich ist.
- `version`: Die Versionsnummer der Erweiterung.
- `version_name`: Ein menschenlesbarer Versionsname oder Label (z. B. "0.1 alpha").
- `description`: Eine kurze Beschreibung dessen, was die Erweiterung tut.
- `permissions`: Listet die Berechtigungen auf, die von der Erweiterung benötigt werden, einschließlich `activeTab` (um auf den aktiven Tab zuzugreifen) und `storage` (um auf die Chrome-Speicherung zuzugreifen).
- `options_page`: Gibt die HTML-Seite an, die für die Optionen/Einstellungen der Erweiterung verwendet wird.
- `icons`: Legt die Icons fest, die in verschiedenen Größen für die Erweiterung verwendet werden.

## `js/injectionHook.js`

- `setDefaultSettings()`: Diese Funktion setzt Standardwerte für die Erweiterung, insbesondere in Bezug auf die Blockierung von Medieninhalten. Sie überprüft, ob die Einstellungen in der Chrome-Speicherung existieren, und legt Standardwerte fest, falls dies nicht der Fall ist. Anschließend ruft sie `loadAndInject()` auf, um Skripte zu laden und zu injizieren.
- `loadAndInject()`: Diese Funktion lädt Einstellungen aus der Chrome-Speicherung, erstellt ein HTML-Element zur Speicherung dieser Einstellungen und injiziert dann Skripte (`js/injected.js` und `js/media-block.js`) in die Webseite. Die injizierten Skripte sind notwendig, damit die Kommunikation der Webseite abgefangen und modifiziert werden kann.

## `js/injected.js`

- `extSettings`: Diese Variable dient zur Speicherung der Erweiterungseinstellungen, die aus dem HTML-Element mit der ID "settings-container" abgerufen werden.
- `global.fetch`: Dieser Code überwacht und überschreibt die `fetch`-Funktion, die für HTTP-Anfragen in der Webseite verwendet wird. Er protokolliert Anfrageinformationen, Header und Antwortheader. Wenn die Anfrage-URL einem bestimmten Muster entspricht und die Blockierung von Medieninhalten in den Einstellungen aktiviert ist, ruft er die Funktion `mediaBlock` auf, um die URL für die Medienblockierung zu modifizieren.

## `js/mediaBlock.js`

- `mediaBlock(url)`: Diese Funktion nimmt eine URL als Eingabe entgegen und modifiziert sie basierend auf dem Dateityp (z. B. jpg, mp4, bin). Wenn der Dateityp mit einem der angegebenen Medientypen übereinstimmt, ersetzt sie die URL durch eine modifizierte URL, die auf Ressourcen innerhalb der Chrome-Erweiterung verweist.

## `js/options.js`

- `saveSettings()`: Diese Funktion wird aufgerufen, wenn der Benutzer auf der Optionsseite auf die Schaltfläche "Speichern" klickt. Sie ruft die Präferenz des Benutzers für die Blockierung von Medieninhalten ab und speichert sie in der Chrome-Speicherung. Außerdem wird eine Benachrichtigung angezeigt, um den Benutzer darüber zu informieren, dass die Einstellungen gespeichert wurden.
- Ereignislistener: Das Skript fügt einen Ereignislistener zur Schaltfläche "Speichern" hinzu, um die Funktion `saveSettings()` auszulösen. Darüber hinaus werden die gespeicherten Einstellungen geladen und angezeigt, wenn die Optionsseite geladen wird.

# ToDo:
- [ ]  Readme mit neuen Funktionen ergänzen
- [ ]  Quellcode besser kommentieren
- [ ]  Möglichkeit schaffen, um bei Alle Konversationen Nachrichten direkt anzuzeigen und zu switchen (iframe)
- [ ]  Konversationen an lokales LLM senden, um Einstufung zu berechnen und entsprechende Ampel anzuzeigen
- [ ]  Assistent für Konversationen (Personendaten, Zusammenfassung, Antwort-Ideen)