import { test } from "node:test";
import assert from "node:assert/strict";
import { KATEGORIEN, TEXTE, kategorieFinden, RICARDO_LINK } from "../texte.js";

const FUSS = "— Der Artikel befindet sich in unserer Brockenstube und kann während der Öffnungszeiten besichtigt und vor Ort gekauft werden, sofern noch kein Gebot abgegeben wurde\n— FRAGEN UND ANLIEGEN WERDEN MONTAG BIS DONNERSTAG BEANTWORTET";

test("Reihenfolge der Kategorien", () => {
  assert.deepEqual(KATEGORIEN.map(k => k.id), ["moebel", "elektronik", "anderes"]);
  assert.deepEqual(KATEGORIEN.map(k => k.name), ["Möbel", "Elektronik", "Anderes"]);
});

test("Möbel-Beschreibung exakt", () => {
  assert.equal(kategorieFinden("moebel").beschreibung,
    "— Alters- und gebrauchsbedingte Spuren vorhanden\n— Kein Versand – nur Abholung\n" + FUSS);
});

test("Elektronik und Anderes ohne Abholungs-Zeile", () => {
  const erwartet = "— Alters- und gebrauchsbedingte Spuren vorhanden\n" + FUSS;
  assert.equal(kategorieFinden("elektronik").beschreibung, erwartet);
  assert.equal(kategorieFinden("anderes").beschreibung, erwartet);
});

test("Checklisten exakt", () => {
  assert.deepEqual(kategorieFinden("moebel").schritte, [
    "Foto machen, Entwurf erstellen",
    "Obersten Entwurf wählen (mehr Bilder möglich)",
    "Produkttyp wählen, Breite, Höhe, Tiefe eintragen",
    "Beschreibung löschen, unseren Text einfügen",
    "Preis: nur Auktion",
    "Lieferung: nur Abholung",
    "Veröffentlichen",
  ]);
  assert.deepEqual(kategorieFinden("elektronik").schritte, [
    "Foto machen, Entwurf erstellen",
    "Obersten Entwurf wählen, Foto eingeschaltet hinzufügen",
    "Produkttyp wählen",
    "Beschreibung löschen, unseren Text einfügen",
    "Preis: nur Auktion",
    "Lieferung: Versand aktivieren",
    "Veröffentlichen",
  ]);
  assert.equal(kategorieFinden("anderes").schritte[1], "Obersten Entwurf wählen");
  assert.equal(kategorieFinden("anderes").schritte.length, 7);
});

test("Hinweis nur bei Elektronik", () => {
  assert.equal(kategorieFinden("elektronik").hinweis,
    "Mach auch ein Foto, wo es eingeschaltet ist, wenn es noch funktioniert. Nicht bei Sammlerobjekten.");
  assert.equal(kategorieFinden("moebel").hinweis, null);
  assert.equal(kategorieFinden("anderes").hinweis, null);
});

test("Zusatz nur bei Elektronik", () => {
  assert.deepEqual(KATEGORIEN.map(k => k.zusatz), [null, "auch Elektrogeräte", null]);
});

test("unbekannte Kategorie", () => {
  assert.equal(kategorieFinden("auto"), undefined);
});

test("Ricardo-Link ist https", () => {
  assert.match(RICARDO_LINK, /^https:\/\/www\.ricardo\.ch\//);
});

test("Rückmeldung nach dem Kopieren", () => {
  assert.equal(TEXTE.kopiert, "Text kopiert ✓");
});

test("Alle Texte sind nicht leer, {n} bleibt erhalten", () => {
  for (const [name, wert] of Object.entries(TEXTE)) {
    assert.equal(typeof wert, "string", name);
    assert.ok(wert.trim().length > 0, `${name} ist leer`);
  }
  assert.ok(TEXTE.artikelNr.includes("{n}"));
});
