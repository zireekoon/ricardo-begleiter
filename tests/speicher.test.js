import { test } from "node:test";
import assert from "node:assert/strict";
import {
  sichererSpeicher,
  datumsSchluessel,
  heuteAnzahl,
  artikelBeginnen,
  laufenderArtikel,
  artikelAbbrechen,
  artikelAbschliessen,
} from "../speicher.js";

function fakeStorage() { const m = new Map(); return { getItem: k => m.has(k) ? m.get(k) : null, setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) }; }
const montag = new Date(2026, 9, 26, 10, 0);
const dienstag = new Date(2026, 9, 27, 9, 0);

test("datumsSchluessel lokal", () => assert.equal(datumsSchluessel(new Date(2026, 0, 5, 23, 59)), "2026-01-05"));
test("leer ergibt 0", () => assert.equal(heuteAnzahl(sichererSpeicher(fakeStorage()), montag), 0));
test("abschliessen zählt hoch", () => {
  const s = sichererSpeicher(fakeStorage());
  artikelBeginnen(s, "moebel");
  assert.equal(artikelAbschliessen(s, montag), 1);
  artikelBeginnen(s, "anderes");
  assert.equal(artikelAbschliessen(s, montag), 2);
  assert.equal(heuteAnzahl(s, montag), 2);
});
test("abschliessen zählt nur einmal", () => {
  const s = sichererSpeicher(fakeStorage());
  artikelBeginnen(s, "moebel");
  assert.equal(artikelAbschliessen(s, montag), 1);
  assert.equal(artikelAbschliessen(s, montag), null);
  assert.equal(heuteAnzahl(s, montag), 1);
});
test("neuer Tag beginnt bei 0", () => {
  const s = sichererSpeicher(fakeStorage());
  artikelBeginnen(s, "moebel"); artikelAbschliessen(s, montag);
  assert.equal(heuteAnzahl(s, dienstag), 0);
  artikelBeginnen(s, "moebel");
  assert.equal(artikelAbschliessen(s, dienstag), 1);
});
test("laufender Artikel überlebt Neuladen", () => {
  const roh = fakeStorage();
  artikelBeginnen(sichererSpeicher(roh), "elektronik");
  assert.equal(laufenderArtikel(sichererSpeicher(roh)), "elektronik");
});
test("abbrechen zählt nicht", () => {
  const s = sichererSpeicher(fakeStorage());
  artikelBeginnen(s, "moebel"); artikelAbbrechen(s);
  assert.equal(laufenderArtikel(s), null);
  assert.equal(heuteAnzahl(s, montag), 0);
});
test("kaputter Speicher wirft nicht", () => {
  const wirft = { getItem() { throw new Error("x"); }, setItem() { throw new Error("x"); }, removeItem() { throw new Error("x"); } };
  const s = sichererSpeicher(wirft);
  artikelBeginnen(s, "moebel");
  assert.equal(artikelAbschliessen(s, montag), 1);
  assert.equal(heuteAnzahl(sichererSpeicher(undefined), montag), 0);
});
test("kaputtes JSON ergibt 0", () => {
  const roh = fakeStorage();
  roh.setItem("begleiter.zaehler", "{kaputt");
  assert.equal(heuteAnzahl(sichererSpeicher(roh), montag), 0);
});
