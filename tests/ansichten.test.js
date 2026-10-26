import { test } from "node:test";
import assert from "node:assert/strict";
import {
  startAnsicht,
  auswahlAnsicht,
  checklisteAnsicht,
  geschafftAnsicht,
  kopierFehlerAnsicht,
  kopiertMeldung,
  escapeHtml,
} from "../ansichten.js";
import { kategorieFinden } from "../texte.js";

test("Start zeigt Anzahl und Neu-Knopf", () => {
  const h = startAnsicht(7);
  assert.match(h, />7</); assert.match(h, /data-aktion="neu"/); assert.match(h, /Heute eingestellt/);
});
test("Auswahl hat drei Knöpfe in Reihenfolge", () => {
  const ids = [...auswahlAnsicht().matchAll(/data-kategorie="(\w+)"/g)].map(m => m[1]);
  assert.deepEqual(ids, ["moebel", "elektronik", "anderes"]);
  assert.match(auswahlAnsicht(), /auch Elektrogeräte/);
  assert.match(auswahlAnsicht(), /<h2>Was ist es\?<\/h2>/);
});
test("Checkliste vor Ricardo: Kopieren-Knopf und Zurück, kein Link, kein Veröffentlicht", () => {
  const h = checklisteAnsicht(kategorieFinden("moebel"), false);
  assert.match(h, /<button type="button"[^>]*data-aktion="kopieren"[^>]*>Text kopieren<\/button>/);
  assert.doesNotMatch(h, /<a[\s>]/);
  assert.doesNotMatch(h, /href=|target=/);
  assert.match(h, /data-aktion="zurueck"/);
  assert.match(h.match(/<button[^>]*data-aktion="zurueck"[^>]*>/)[0], /knopf-klein/);
  assert.doesNotMatch(h, /data-aktion="veroeffentlicht"/);
  assert.equal((h.match(/<li/g) || []).length, 8);
  assert.match(h, /<li>Ricardo-App öffnen<\/li>/);
});
test("Checkliste laufend: Veröffentlicht, nochmals kopieren, abbrechen", () => {
  const h = checklisteAnsicht(kategorieFinden("anderes"), true);
  for (const a of ["veroeffentlicht", "nochmals-kopieren", "abbrechen"]) assert.match(h, new RegExp(`data-aktion="${a}"`));
  assert.doesNotMatch(h, /data-aktion="kopieren"/);
});
test("Hinweis nur bei Elektronik", () => {
  assert.match(checklisteAnsicht(kategorieFinden("elektronik"), false), /class="hinweis"/);
  assert.doesNotMatch(checklisteAnsicht(kategorieFinden("moebel"), false), /class="hinweis"/);
});
test("Geschafft mit Nummer", () => {
  const h = geschafftAnsicht(8);
  assert.match(h, /Geschafft!/); assert.match(h, /Das war Artikel Nr\. 8 heute/); assert.match(h, /data-aktion="naechster"/);
});
test("Texte werden escaped", () => {
  assert.equal(escapeHtml(`<b>"A" & 'B'</b>`), "&lt;b&gt;&quot;A&quot; &amp; &#39;B&#39;&lt;/b&gt;");
  const k = { id: "anderes", name: "X", symbol: "📦", hinweis: "<i>", schritte: ["A & B"], beschreibung: "" };
  const h = checklisteAnsicht(k, false);
  assert.match(h, /&lt;i&gt;/); assert.match(h, /A &amp; B/);
});
test("Kopierfehler zeigt Text", () => {
  const h = kopierFehlerAnsicht("Zeile 1\nZeile 2");
  assert.match(h, /<textarea[^>]*readonly/); assert.match(h, /Zeile 1\nZeile 2/);
});
test("Checkliste nennt oben die Kategorie (Symbol und Name), vor der Überschrift", () => {
  for (const id of ["moebel", "elektronik", "anderes"]) {
    const k = kategorieFinden(id);
    for (const laufend of [false, true]) {
      const h = checklisteAnsicht(k, laufend);
      const zeile = h.match(/<p class="kategorie">([\s\S]*?)<\/p>/);
      assert.ok(zeile, `${id}: Kategorie-Zeile fehlt`);
      assert.ok(zeile[1].includes(k.name), `${id}: Name fehlt`);
      assert.ok(zeile[1].includes(k.symbol), `${id}: Symbol fehlt`);
      assert.ok(h.indexOf('class="kategorie"') < h.indexOf("<h2>"), `${id}: Kategorie muss über der Überschrift stehen`);
    }
  }
  assert.match(checklisteAnsicht(kategorieFinden("moebel"), false), /Möbel/);
  assert.match(checklisteAnsicht(kategorieFinden("elektronik"), true), /Elektronik/);
  assert.doesNotMatch(checklisteAnsicht(kategorieFinden("moebel"), false), /Elektronik/);
});
test("Kategorie-Name und Symbol werden escaped", () => {
  const k = { id: "x", name: "<b>Möbel</b>", symbol: "<i>", hinweis: null, schritte: [], beschreibung: "" };
  const h = checklisteAnsicht(k, true);
  assert.match(h, /&lt;b&gt;Möbel&lt;\/b&gt;/);
  assert.match(h, /&lt;i&gt;/);
  assert.doesNotMatch(h, /<b>/);
});
test("Kopiert-Meldung zeigt den Text aus texte.js", () => {
  const h = kopiertMeldung();
  assert.match(h, /id="kopiert"/);
  assert.match(h, /Text kopiert ✓/);
});
