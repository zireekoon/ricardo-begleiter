import { test } from "node:test";
import assert from "node:assert/strict";
import {
  startAnsicht,
  auswahlAnsicht,
  checklisteAnsicht,
  geschafftAnsicht,
  kopierFehlerAnsicht,
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
});
test("Checkliste vor Ricardo: Kopieren-Link und Zurück, kein Veröffentlicht", () => {
  const h = checklisteAnsicht(kategorieFinden("moebel"), false);
  assert.match(h, /data-aktion="kopieren-oeffnen"[^>]*href="https:\/\/www\.ricardo\.ch\//);
  assert.match(h, /data-aktion="zurueck"/);
  assert.doesNotMatch(h, /data-aktion="veroeffentlicht"/);
  assert.equal((h.match(/<li/g) || []).length, 7);
});
test("Checkliste laufend: Veröffentlicht, nochmals kopieren, abbrechen", () => {
  const h = checklisteAnsicht(kategorieFinden("anderes"), true);
  for (const a of ["veroeffentlicht", "nochmals-kopieren", "abbrechen"]) assert.match(h, new RegExp(`data-aktion="${a}"`));
  assert.doesNotMatch(h, /data-aktion="kopieren-oeffnen"/);
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
