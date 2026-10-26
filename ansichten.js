// Ansichten: jede Funktion gibt den HTML-Text für einen Bildschirm zurück.
// Alle Texte kommen aus texte.js und gehen durch escapeHtml.
// Die Schaltflächen tragen ein data-aktion-Attribut; die App liest es beim Klicken.

import { TEXTE, KATEGORIEN } from "./texte.js";

// Macht aus Text etwas, das im HTML sicher angezeigt wird.
export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Startbildschirm: Anzahl der heute veröffentlichten Artikel und Knopf für einen neuen Artikel.
export function startAnsicht(anzahl) {
  return `<section class="ansicht">
  <p>${escapeHtml(TEXTE.heuteEingestellt)}</p>
  <div class="zaehler">${escapeHtml(anzahl)}</div>
  <button type="button" class="knopf knopf-haupt" data-aktion="neu">${escapeHtml(TEXTE.neuerArtikel)}</button>
</section>`;
}

// Auswahl der Kategorie: ein Knopf pro Kategorie, in der Reihenfolge von KATEGORIEN.
export function auswahlAnsicht() {
  const knoepfe = KATEGORIEN.map(
    (k) => `  <button type="button" class="knopf knopf-haupt" data-aktion="waehlen" data-kategorie="${escapeHtml(k.id)}">
    <span aria-hidden="true">${escapeHtml(k.symbol)}</span>
    <span>${escapeHtml(k.name)}</span>${k.zusatz ? `
    <small>${escapeHtml(k.zusatz)}</small>` : ""}
  </button>`
  ).join("\n");
  return `<section class="ansicht">
  <h2>${escapeHtml(TEXTE.wasIstEs)}</h2>
${knoepfe}
</section>`;
}

// Checkliste für eine Kategorie. Oben steht gross, um welche Art Artikel es geht
// (Symbol und Name), damit man beim Weitermachen oder nach einem Fehltipp sofort sieht,
// welche Checkliste und welcher Text gerade gelten.
// laufend = false: vor dem Einstellen in Ricardo (Text kopieren).
// laufend = true: Artikel läuft schon (veröffentlichen, nochmals kopieren, abbrechen).
export function checklisteAnsicht(kategorie, laufend) {
  const hinweis = kategorie.hinweis
    ? `<p class="hinweis">${escapeHtml(kategorie.hinweis)}</p>`
    : "";
  const schritte = kategorie.schritte
    .map((schritt) => `<li>${escapeHtml(schritt)}</li>`)
    .join("");
  const knoepfe = laufend
    ? `<button type="button" class="knopf knopf-haupt" data-aktion="veroeffentlicht">${escapeHtml(TEXTE.veroeffentlicht)}</button>
  <button type="button" class="knopf knopf-neben" data-aktion="nochmals-kopieren">${escapeHtml(TEXTE.nochmalsKopieren)}</button>
  <button type="button" class="knopf knopf-klein" data-aktion="abbrechen">${escapeHtml(TEXTE.abbrechen)}</button>`
    : `<button type="button" class="knopf knopf-haupt" data-aktion="kopieren">${escapeHtml(TEXTE.kopieren)}</button>
  <button type="button" class="knopf knopf-klein" data-aktion="zurueck">${escapeHtml(TEXTE.zurueck)}</button>`;
  return `<section class="ansicht">
  <p class="kategorie"><span aria-hidden="true">${escapeHtml(kategorie.symbol)}</span> ${escapeHtml(kategorie.name)}</p>
  <h2>${escapeHtml(TEXTE.soGehts)}</h2>
  ${hinweis}
  <ol class="schritte">${schritte}</ol>
  ${knoepfe}
</section>`;
}

// Bildschirm nach dem Veröffentlichen: zeigt die Nummer des Artikels heute.
export function geschafftAnsicht(nummer) {
  const text = TEXTE.artikelNr.replace("{n}", String(nummer));
  return `<section class="ansicht">
  <h2>${escapeHtml(TEXTE.geschafft)}</h2>
  <p>${escapeHtml(text)}</p>
  <button type="button" class="knopf knopf-haupt" data-aktion="naechster">${escapeHtml(TEXTE.naechster)}</button>
</section>`;
}

// Kurze Bestätigung "Text kopiert ✓"; die App hängt sie für ein paar Sekunden unter den Knopf.
export function kopiertMeldung() {
  return `<p id="kopiert" class="rueckmeldung" role="status">${escapeHtml(TEXTE.kopiert)}</p>`;
}

// Bildschirm, wenn das automatische Kopieren nicht geklappt hat: der Text steht zum Markieren bereit.
export function kopierFehlerAnsicht(text) {
  return `<section class="ansicht">
  <p>${escapeHtml(TEXTE.kopierFehler)}</p>
  <textarea readonly>${escapeHtml(text)}</textarea>
</section>`;
}
