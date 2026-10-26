// Offline-Betrieb: Der Service Worker hält eine Kopie der App auf dem Gerät.
// Er lädt immer zuerst vom Netz (so kommen Textänderungen beim nächsten Online-Gang an)
// und greift auf die Kopie zurück, wenn das Netz fehlt oder zu langsam ist.
// Alle Adressen sind relativ zu dieser Datei, damit die App auch unter einem Unterpfad
// (z.B. /ricardo-begleiter/ auf GitHub Pages) läuft.

const CACHE_NAME = "begleiter-v1";

// So lange wartet die App bei schwachem Netz höchstens auf eine Antwort, bevor sie die Kopie zeigt.
// Schwaches WLAN hängt meist, statt sauber auszufallen; ohne diese Grenze würde jeder Seitenaufruf
// (und jede einzelne Datei) bis zur Wartezeit des Browsers stehen bleiben.
const NETZ_GEDULD_MS = 3000;

const DATEIEN = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "texte.js",
  "speicher.js",
  "ansichten.js",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(DATEIEN)));
});

// Alte Kopien (andere Cache-Namen) wegräumen.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((namen) =>
        Promise.all(namen.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))),
      ),
  );
});

self.addEventListener("fetch", (event) => {
  const anfrage = event.request;
  // Alles andere (fremde Adressen, nicht-GET) läuft unberührt am Service Worker vorbei.
  if (anfrage.method !== "GET") return;
  if (new URL(anfrage.url).origin !== self.location.origin) return;
  event.respondWith(netzZuerst(event, anfrage));
});

// Die Kopie dieser Anfrage; bei einer Seitenanfrage ohne eigene Kopie die gespeicherte index.html.
async function kopieFinden(cache, anfrage) {
  const kopie = await cache.match(anfrage);
  if (kopie) return kopie;
  if (anfrage.mode === "navigate") return cache.match(new URL("index.html", self.location));
  return undefined;
}

async function netzZuerst(event, anfrage) {
  const cache = await caches.open(CACHE_NAME);
  const kopie = await kopieFinden(cache, anfrage);
  // Nur wenn es eine Kopie gibt, wird die Wartezeit begrenzt. Ohne Kopie gäbe es nichts anderes
  // zu zeigen; ein Abbruch würde aus einer langsamen Seite nur einen Fehler machen.
  const abbruch = new AbortController();
  const wecker = kopie ? setTimeout(() => abbruch.abort(), NETZ_GEDULD_MS) : null;
  try {
    // "no-cache": den Browser-Zwischenspeicher beim Server nachfragen lassen, damit
    // wirklich die neueste Fassung ankommt.
    const antwort = await fetch(anfrage, { cache: "no-cache", signal: abbruch.signal });
    if (antwort.ok) {
      // Kopie auffrischen; scheitert das Speichern, wird trotzdem die Netz-Antwort gezeigt.
      event.waitUntil(cache.put(anfrage, antwort.clone()).catch(() => {}));
    }
    return antwort;
  } catch {
    // Netz fehlt oder war zu langsam.
    return kopie ?? Response.error();
  } finally {
    clearTimeout(wecker); // Sobald die Antwort da ist, wird nicht mehr abgebrochen.
  }
}
