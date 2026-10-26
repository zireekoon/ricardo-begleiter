// Offline-Betrieb: Der Service Worker hält eine Kopie der App auf dem Gerät.
// Er lädt immer zuerst vom Netz (so kommen Textänderungen beim nächsten Online-Gang an)
// und greift nur auf die Kopie zurück, wenn das Netz fehlt.
// Alle Adressen sind relativ zu dieser Datei, damit die App auch unter einem Unterpfad
// (z.B. /ricardo-begleiter/ auf GitHub Pages) läuft.

const CACHE_NAME = "begleiter-v1";

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

async function netzZuerst(event, anfrage) {
  const cache = await caches.open(CACHE_NAME);
  try {
    // "no-cache": den Browser-Zwischenspeicher beim Server nachfragen lassen, damit
    // wirklich die neueste Fassung ankommt.
    const antwort = await fetch(anfrage, { cache: "no-cache" });
    if (antwort.ok) {
      // Kopie auffrischen; scheitert das Speichern, wird trotzdem die Netz-Antwort gezeigt.
      event.waitUntil(cache.put(anfrage, antwort.clone()).catch(() => {}));
    }
    return antwort;
  } catch {
    const kopie = await cache.match(anfrage);
    if (kopie) return kopie;
    if (anfrage.mode === "navigate") {
      const startseite = await cache.match(new URL("index.html", self.location));
      if (startseite) return startseite;
    }
    return Response.error();
  }
}
