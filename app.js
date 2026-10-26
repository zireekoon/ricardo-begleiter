// Die App-Seite: verbindet die Ansichten (ansichten.js) mit dem Speicher (speicher.js).
// Es gibt nur einen Klick-Hörer auf #app; er liest das data-aktion der angeklickten Schaltfläche.

import { kategorieFinden } from "./texte.js";
import {
  sichererSpeicher,
  heuteAnzahl,
  artikelBeginnen,
  laufenderArtikel,
  artikelAbbrechen,
  artikelAbschliessen,
} from "./speicher.js";
import {
  startAnsicht,
  auswahlAnsicht,
  checklisteAnsicht,
  geschafftAnsicht,
  kopierFehlerAnsicht,
} from "./ansichten.js";

const app = document.querySelector("#app");

// Schon der Zugriff auf localStorage kann einen Fehler werfen (z.B. wenn der Browser Speicher sperrt).
function browserSpeicher() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

const speicher = sichererSpeicher(browserSpeicher());

// Die Kategorie, die gerade gewählt ist oder läuft.
let aktuell = null;

// Zeigt eine Ansicht und springt nach oben.
function zeige(html) {
  app.innerHTML = html;
  window.scrollTo(0, 0);
}

function zeigeStart() {
  zeige(startAnsicht(heuteAnzahl(speicher, new Date())));
}

// Kopiert die Beschreibung. Muss direkt im Klick aufgerufen werden (vor jedem await).
// Gibt ein Versprechen zurück, das true (geklappt) oder false (nicht geklappt) liefert.
function kopieren(kategorie) {
  try {
    return navigator.clipboard.writeText(kategorie.beschreibung).then(
      () => true,
      () => false,
    );
  } catch {
    // navigator.clipboard fehlt (z.B. keine sichere Verbindung).
    return Promise.resolve(false);
  }
}

// Hängt den Text zum Selbst-Kopieren unter die Checkliste. Die Knöpfe der Checkliste bleiben.
function kopierFehlerZeigen(kategorie) {
  if (!app.querySelector(".schritte")) return; // Es wird keine Checkliste mehr gezeigt.
  app.querySelector("#kopierfehler")?.remove();
  app.insertAdjacentHTML(
    "beforeend",
    `<div id="kopierfehler">${kopierFehlerAnsicht(kategorie.beschreibung)}</div>`,
  );
  app.querySelector("#kopierfehler").scrollIntoView({ block: "nearest" });
}

app.addEventListener("click", (event) => {
  const knopf = event.target.closest("[data-aktion]");
  if (!knopf) return;

  switch (knopf.dataset.aktion) {
    case "neu":
    case "naechster":
    case "zurueck":
      zeige(auswahlAnsicht());
      break;

    case "waehlen": {
      const kategorie = kategorieFinden(knopf.dataset.kategorie);
      if (!kategorie) return;
      aktuell = kategorie;
      zeige(checklisteAnsicht(kategorie, false));
      break;
    }

    case "kopieren-oeffnen": {
      // Kein preventDefault: der Link soll Ricardo öffnen.
      // Die Ansicht wird erst nach dem Klick getauscht, sonst würde der Link verschwinden,
      // bevor der Browser ihn öffnen konnte.
      const kategorie = aktuell;
      if (!kategorie) return;
      const kopiert = kopieren(kategorie);
      artikelBeginnen(speicher, kategorie.id);
      setTimeout(() => {
        zeige(checklisteAnsicht(kategorie, true));
        kopiert.then((geklappt) => {
          if (!geklappt) kopierFehlerZeigen(kategorie);
        });
      }, 0);
      break;
    }

    case "nochmals-kopieren": {
      const kategorie = aktuell;
      if (!kategorie) return;
      kopieren(kategorie).then((geklappt) => {
        if (!geklappt) kopierFehlerZeigen(kategorie);
      });
      break;
    }

    case "veroeffentlicht": {
      const nummer = artikelAbschliessen(speicher, new Date());
      if (nummer === null) {
        zeigeStart();
      } else {
        zeige(geschafftAnsicht(nummer));
      }
      break;
    }

    case "abbrechen":
      artikelAbbrechen(speicher);
      zeigeStart();
      break;
  }
});

// Beim Laden: ein laufender Artikel wird wieder gezeigt, sonst der Start.
const gespeichert = laufenderArtikel(speicher);
const laufend = kategorieFinden(gespeichert);
if (laufend) {
  aktuell = laufend;
  zeige(checklisteAnsicht(laufend, true));
} else {
  if (gespeichert !== null) artikelAbbrechen(speicher); // Unbekannte Kategorie: verwerfen.
  zeigeStart();
}
