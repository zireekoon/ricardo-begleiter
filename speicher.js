// Speichert den Tageszähler und den gerade bearbeiteten Artikel auf dem Gerät.
// Fällt der Browser-Speicher aus, wird der Stand nur im Arbeitsspeicher gehalten.

const ZAEHLER_SCHLUESSEL = "begleiter.zaehler";
const LAUFEND_SCHLUESSEL = "begleiter.laufend";

// Liefert ein Speicher-Objekt mit lesen, schreiben und loeschen.
// Wirft der echte Speicher einmal, wird ab dann dauerhaft der Arbeitsspeicher benutzt.
export function sichererSpeicher(storage) {
  let echter = storage ?? null;
  const notfall = new Map();

  function ausfuehren(aufEchtem, aufNotfall) {
    if (echter) {
      try {
        return aufEchtem(echter);
      } catch {
        echter = null;
      }
    }
    return aufNotfall(notfall);
  }

  return {
    lesen: key => ausfuehren(s => s.getItem(key), m => (m.has(key) ? m.get(key) : null)),
    schreiben: (key, value) => ausfuehren(s => { s.setItem(key, value); }, m => { m.set(key, String(value)); }),
    loeschen: key => ausfuehren(s => { s.removeItem(key); }, m => { m.delete(key); }),
  };
}

// Lokales Kalenderdatum als "YYYY-MM-DD" (nicht UTC).
export function datumsSchluessel(jetzt) {
  const monat = String(jetzt.getMonth() + 1).padStart(2, "0");
  const tag = String(jetzt.getDate()).padStart(2, "0");
  return `${jetzt.getFullYear()}-${monat}-${tag}`;
}

// Liest den Zähler; kaputte oder fehlende Daten gelten als leer.
function zaehlerLesen(speicher) {
  const roh = speicher.lesen(ZAEHLER_SCHLUESSEL);
  if (roh !== null) {
    try {
      const daten = JSON.parse(roh);
      if (typeof daten?.datum === "string" && Number.isInteger(daten?.anzahl)) return daten;
    } catch {
      // Kaputtes JSON: wie leer behandeln.
    }
  }
  return { datum: null, anzahl: 0 };
}

// Anzahl der heute abgeschlossenen Artikel.
export function heuteAnzahl(speicher, jetzt) {
  const zaehler = zaehlerLesen(speicher);
  return zaehler.datum === datumsSchluessel(jetzt) ? zaehler.anzahl : 0;
}

// Merkt sich den Artikel, der gerade eingestellt wird. Ein bereits laufender wird ersetzt.
export function artikelBeginnen(speicher, kategorieId) {
  speicher.schreiben(LAUFEND_SCHLUESSEL, kategorieId);
}

// Kategorie-ID des laufenden Artikels oder null.
export function laufenderArtikel(speicher) {
  return speicher.lesen(LAUFEND_SCHLUESSEL);
}

// Verwirft den laufenden Artikel ohne zu zählen.
export function artikelAbbrechen(speicher) {
  speicher.loeschen(LAUFEND_SCHLUESSEL);
}

// Zählt den laufenden Artikel als veröffentlicht. Gibt die neue Tagesanzahl zurück
// oder null, wenn nichts lief (dann wird nicht gezählt).
export function artikelAbschliessen(speicher, jetzt) {
  if (laufenderArtikel(speicher) === null) return null;
  const heute = datumsSchluessel(jetzt);
  const anzahl = heuteAnzahl(speicher, jetzt) + 1;
  speicher.schreiben(ZAEHLER_SCHLUESSEL, JSON.stringify({ datum: heute, anzahl }));
  speicher.loeschen(LAUFEND_SCHLUESSEL);
  return anzahl;
}
