// ============================================================================
// HIER STEHEN ALLE TEXTE DER APP. Du darfst sie ändern.
//
// So geht es sicher. Bitte genau beachten, sonst bleibt die App leer:
//
//  1. Ändere nur den Text zwischen den Anführungszeichen "…".
//     Bei den langen Beschreibungen und beim Fusstext steht der Text stattdessen
//     zwischen zwei schrägen Strichen ` … ` (Backticks).
//  2. Lass die Anführungszeichen, die schrägen Striche und das Komma am Ende
//     jeder Zeile stehen. Fehlt eines davon, bleibt die ganze App leer.
//  3. Im Text selbst darf kein gerades Anführungszeichen " vorkommen.
//     Schreibe stattdessen « » oder „ “. Das Zeichen ' ist erlaubt.
//     In den Beschreibungen zwischen ` … ` darf kein schräger Strich ` vorkommen.
//  4. Lass {n} unverändert: Dort setzt die App die Zahl ein.
//     Lass auch ${FUSS} unverändert: Dort setzt die App den Fusstext ein.
//  5. Eine neue Zeile (Enter) ist nur in den langen Beschreibungen zwischen
//     ` … ` erlaubt. Alle anderen Texte müssen in einer einzigen Zeile stehen.
//  6. Was links vom Doppelpunkt steht (z.B. neuerArtikel:), nie ändern.
//  7. Ändere immer nur eine Sache auf einmal. Nach dem Speichern auf github.com
//     1 bis 2 Minuten warten, dann die App öffnen und prüfen.
//     Erscheint nur «Die App lädt …» oder ein leerer Bildschirm, steckt ein
//     Fehler im Text. Mach deine Änderung dann rückgängig (der alte Stand steht
//     bei dieser Datei oben rechts unter «History») und speichere nochmals.
// ============================================================================

// Alle Texte der Oberfläche.
export const TEXTE = {
  heuteEingestellt: "Heute eingestellt",
  neuerArtikel: "Neuer Artikel",
  wasIstEs: "Was ist es?",
  soGehts: "So geht's in Ricardo",
  kopieren: "Text kopieren",
  nochmalsKopieren: "Text nochmals kopieren",
  veroeffentlicht: "Veröffentlicht",
  zurueck: "Zurück",
  abbrechen: "Artikel abbrechen",
  geschafft: "Geschafft!",
  artikelNr: "Das war Artikel Nr. {n} heute",
  naechster: "Nächster Artikel",
  kopierFehler: "Kopieren hat nicht geklappt. Halte den Finger auf den Text und wähle «Kopieren».",
  kopiert: "Text kopiert ✓",
};

// Fusstext, der bei jeder Beschreibung unten steht (siehe ${FUSS} weiter unten).
const FUSS = `— Der Artikel befindet sich in unserer Brockenstube und kann während der Öffnungszeiten besichtigt und vor Ort gekauft werden, sofern noch kein Gebot abgegeben wurde
— FRAGEN UND ANLIEGEN WERDEN MONTAG BIS DONNERSTAG BEANTWORTET`;

// Die drei Kategorien, in der Reihenfolge, in der sie angezeigt werden.
// Bei zusatz und hinweis bedeutet null: kein Text. Soll dort ein Text erscheinen,
// schreibe ihn in Anführungszeichen an die Stelle von null.
export const KATEGORIEN = [
  {
    id: "moebel",
    name: "Möbel",
    zusatz: null,
    symbol: "🪑",
    hinweis: null,
    schritte: [
      "Ricardo-App öffnen",
      "Foto machen, Entwurf erstellen",
      "Obersten Entwurf wählen (mehr Bilder möglich)",
      "Produkttyp wählen, Breite, Höhe, Tiefe eintragen",
      "Beschreibung löschen, unseren Text einfügen",
      "Preis: nur Auktion",
      "Lieferung: nur Abholung",
      "Veröffentlichen",
    ],
    beschreibung: `— Alters- und gebrauchsbedingte Spuren vorhanden
— Kein Versand – nur Abholung
${FUSS}`,
  },
  {
    id: "elektronik",
    name: "Elektronik",
    zusatz: "auch Elektrogeräte",
    symbol: "🔌",
    hinweis:
      "Mach auch ein Foto, wo es eingeschaltet ist, wenn es noch funktioniert. Nicht bei Sammlerobjekten.",
    schritte: [
      "Ricardo-App öffnen",
      "Foto machen, Entwurf erstellen",
      "Obersten Entwurf wählen, Foto eingeschaltet hinzufügen",
      "Produkttyp wählen",
      "Beschreibung löschen, unseren Text einfügen",
      "Preis: nur Auktion",
      "Lieferung: Versand aktivieren",
      "Veröffentlichen",
    ],
    beschreibung: `— Alters- und gebrauchsbedingte Spuren vorhanden
${FUSS}`,
  },
  {
    id: "anderes",
    name: "Anderes",
    zusatz: null,
    symbol: "📦",
    hinweis: null,
    schritte: [
      "Ricardo-App öffnen",
      "Foto machen, Entwurf erstellen",
      "Obersten Entwurf wählen",
      "Produkttyp wählen",
      "Beschreibung löschen, unseren Text einfügen",
      "Preis: nur Auktion",
      "Lieferung: Versand aktivieren",
      "Veröffentlichen",
    ],
    beschreibung: `— Alters- und gebrauchsbedingte Spuren vorhanden
${FUSS}`,
  },
];

// Sucht eine Kategorie anhand ihrer id, z.B. "moebel".
// Gibt undefined zurück, wenn es keine solche Kategorie gibt.
export function kategorieFinden(id) {
  return KATEGORIEN.find((kategorie) => kategorie.id === id);
}
