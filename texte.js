// Hier stehen alle Texte der App. Du kannst sie ändern.
// Ändere nur den Text zwischen den Anführungszeichen.
// Das Zeichen \n bedeutet: neue Zeile.

// Link zur Ricardo-Verkaufsseite (wird von der App nur als Link geöffnet).
export const RICARDO_LINK = "https://www.ricardo.ch/de/verkaufen/";

// Alle Texte der Oberfläche.
export const TEXTE = {
  heuteEingestellt: "Heute eingestellt",
  neuerArtikel: "Neuer Artikel",
  wasIstEs: "Was ist es?",
  soGehts: "So geht's in Ricardo",
  kopierenUndOeffnen: "Text kopieren und Ricardo öffnen",
  nochmalsKopieren: "Text nochmals kopieren",
  veroeffentlicht: "Veröffentlicht",
  zurueck: "Zurück",
  abbrechen: "Artikel abbrechen",
  geschafft: "Geschafft!",
  artikelNr: "Das war Artikel Nr. {n} heute",
  naechster: "Nächster Artikel",
  kopierFehler: "Kopieren hat nicht geklappt. Halte den Finger auf den Text und wähle «Kopieren».",
};

// Fusstext, der bei jeder Beschreibung unten steht.
const FUSS = "— Der Artikel befindet sich in unserer Brockenstube und kann während der Öffnungszeiten besichtigt und vor Ort gekauft werden, sofern noch kein Gebot abgegeben wurde\n— FRAGEN UND ANLIEGEN WERDEN MONTAG BIS DONNERSTAG BEANTWORTET";

// Die drei Kategorien, in der Reihenfolge, in der sie angezeigt werden.
export const KATEGORIEN = [
  {
    id: "moebel",
    name: "Möbel",
    zusatz: null,
    symbol: "🪑",
    hinweis: null,
    schritte: [
      "Foto machen, Entwurf erstellen",
      "Obersten Entwurf wählen (mehr Bilder möglich)",
      "Produkttyp wählen, Breite, Höhe, Tiefe eintragen",
      "Beschreibung löschen, unseren Text einfügen",
      "Preis: nur Auktion",
      "Lieferung: nur Abholung",
      "Veröffentlichen",
    ],
    beschreibung:
      "— Alters- und gebrauchsbedingte Spuren vorhanden\n— Kein Versand – nur Abholung\n" + FUSS,
  },
  {
    id: "elektronik",
    name: "Elektronik",
    zusatz: "auch Elektrogeräte",
    symbol: "🔌",
    hinweis:
      "Mach auch ein Foto, wo es eingeschaltet ist, wenn es noch funktioniert. Nicht bei Sammlerobjekten.",
    schritte: [
      "Foto machen, Entwurf erstellen",
      "Obersten Entwurf wählen, Foto eingeschaltet hinzufügen",
      "Produkttyp wählen",
      "Beschreibung löschen, unseren Text einfügen",
      "Preis: nur Auktion",
      "Lieferung: Versand aktivieren",
      "Veröffentlichen",
    ],
    beschreibung: "— Alters- und gebrauchsbedingte Spuren vorhanden\n" + FUSS,
  },
  {
    id: "anderes",
    name: "Anderes",
    zusatz: null,
    symbol: "📦",
    hinweis: null,
    schritte: [
      "Foto machen, Entwurf erstellen",
      "Obersten Entwurf wählen",
      "Produkttyp wählen",
      "Beschreibung löschen, unseren Text einfügen",
      "Preis: nur Auktion",
      "Lieferung: Versand aktivieren",
      "Veröffentlichen",
    ],
    beschreibung: "— Alters- und gebrauchsbedingte Spuren vorhanden\n" + FUSS,
  },
];

// Sucht eine Kategorie anhand ihrer id, z.B. "moebel".
// Gibt undefined zurück, wenn es keine solche Kategorie gibt.
export function kategorieFinden(id) {
  return KATEGORIEN.find((kategorie) => kategorie.id === id);
}
