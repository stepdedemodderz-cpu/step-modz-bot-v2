 de: {
    fileTooLarge: "Die Datei ist zu groß. Bitte lade eine kleinere Datei hoch.",
    downloadFailed: "Die Datei konnte nicht heruntergeladen werden.",
    invalidFileTypeJson: "Bitte lade eine .json Datei hoch.",
    invalidFileTypeXml: "Bitte lade eine .xml Datei hoch.",
    invalidFileTypeDayz: "Bitte lade eine .json oder .xml Datei hoch.",
    validationSuccessTitle: "✅ Datei erfolgreich geprüft",
    validationFailedTitle: "❌ Datei enthält Fehler",
    unknownError: "Unbekannter Fehler",
    fileName: "Dateiname",
    fileType: "Dateityp",
    status: "Status",
    valid: "Gültig",
    invalid: "Ungültig",
    errorMessage: "Fehlermeldung",
    position: "Position",
    lineColumn: "Zeile / Spalte",
    hint: "Hinweis",
    jsonHint: "Prüfe Kommas, Klammern oder Anführungszeichen.",
    xmlHint: "Prüfe Tags oder Struktur.",
    dayzHint: "Prüfe die Datei auf Fehler.",
    checkedBy: "Step Mod!Z BOT Validator",
    unsupportedExtension: "Dieser Dateityp wird noch nicht unterstützt.",
    dayzJsonLabel: "DayZ JSON",
    dayzXmlLabel: "DayZ XML"
  },

  en: {
    fileTooLarge: "File too large.",
    downloadFailed: "Download failed.",
    invalidFileTypeJson: "Upload a .json file.",
    invalidFileTypeXml: "Upload a .xml file.",
    invalidFileTypeDayz: "Upload a .json or .xml file.",
    validationSuccessTitle: "✅ File valid",
    validationFailedTitle: "❌ File invalid",
    unknownError: "Unknown error",
    fileName: "File name",
    fileType: "File type",
    status: "Status",
    valid: "Valid",
    invalid: "Invalid",
    errorMessage: "Error",
    position: "Position",
    lineColumn: "Line / Column",
    hint: "Hint",
    jsonHint: "Check commas and brackets.",
    xmlHint: "Check tags.",
    dayzHint: "Check file.",
    checkedBy: "Step Mod!Z BOT Validator",
    unsupportedExtension: "This file type is not supported yet.",
    dayzJsonLabel: "DayZ JSON",
    dayzXmlLabel: "DayZ XML"
  }
};

export function t(lang = "de", key) {
  const shortLang = typeof lang === "string" ? lang.split("-")[0] : "de";
  return messages[shortLang]?.[key] || messages.de?.[key] || key;
}