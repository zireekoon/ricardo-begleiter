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
  kopiertMeldung,
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

// Doppeltipp-Schutz. Eine neue Ansicht erscheint an derselben Stelle wie die vorige; ein
// Doppeltipp zählt als zwei Klicks, und der zweite würde sonst den Knopf der neuen Ansicht treffen.
// Darum werden Klicks nach jedem Bildschirmwechsel kurz ignoriert (Zeiten in Millisekunden).
const SPERRE_MS = 700;
// Nach "Text kopieren" etwas länger: An derselben Stelle erscheint gleich der "Veröffentlicht"-Knopf.
const SPERRE_NACH_KOPIEREN_MS = 1500;
// So lange zeigt die App "Text kopiert ✓".
const KOPIERT_ANZEIGE_MS = 2000;

let gesperrtBis = 0;
let kopiertTimer = null;

// Zeigt eine Ansicht und springt nach oben.
function zeige(html) {
  clearTimeout(kopiertTimer);
  app.innerHTML = html;
  window.scrollTo(0, 0);
  gesperrtBis = Date.now() + SPERRE_MS;
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

// Markiert den ganzen Text im Feld, damit man ihn gleich kopieren kann.
// setSelectionRange gehört dazu, weil select() allein auf dem iPad oft nicht reicht.
function alleMarkieren(feld) {
  feld.select();
  feld.setSelectionRange(0, feld.value.length);
}

// Hängt den Text zum Selbst-Kopieren unter die Checkliste. Die Knöpfe der Checkliste bleiben.
function kopierFehlerZeigen(kategorie) {
  if (!app.querySelector(".schritte")) return; // Es wird keine Checkliste mehr gezeigt.
  clearTimeout(kopiertTimer);
  app.querySelector("#kopiert")?.remove();
  app.querySelector("#kopierfehler")?.remove();
  app.insertAdjacentHTML(
    "beforeend",
    `<div id="kopierfehler">${kopierFehlerAnsicht(kategorie.beschreibung)}</div>`,
  );
  const kasten = app.querySelector("#kopierfehler");
  kasten.scrollIntoView({ block: "nearest" });
  const feld = kasten.querySelector("textarea");
  feld.focus({ preventScroll: true });
  alleMarkieren(feld);
}

// Zeigt für kurze Zeit "Text kopiert ✓" unter dem Knopf "Text nochmals kopieren".
// Eine Fehlermeldung vom vorigen Versuch verschwindet.
function kopiertZeigen() {
  const knopf = app.querySelector('[data-aktion="nochmals-kopieren"]');
  if (!knopf) return; // Es wird keine laufende Checkliste mehr gezeigt.
  clearTimeout(kopiertTimer);
  app.querySelector("#kopierfehler")?.remove();
  app.querySelector("#kopiert")?.remove();
  knopf.insertAdjacentHTML("afterend", kopiertMeldung());
  kopiertTimer = setTimeout(() => app.querySelector("#kopiert")?.remove(), KOPIERT_ANZEIGE_MS);
}

// Wenn jemand das Textfeld antippt, wird der ganze Text markiert.
app.addEventListener("focusin", (event) => {
  if (event.target.matches("textarea")) alleMarkieren(event.target);
});

app.addEventListener("click", (event) => {
  // Kurz nach einem Bildschirmwechsel: ignorieren.
  if (Date.now() < gesperrtBis) {
    event.preventDefault();
    return;
  }

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

    case "kopieren": {
      // Kopiert den Text; danach öffnet man selbst die Ricardo-App (Schritt 1 der Checkliste).
      const kategorie = aktuell;
      if (!kategorie) return;
      const kopiert = kopieren(kategorie);
      artikelBeginnen(speicher, kategorie.id);
      zeige(checklisteAnsicht(kategorie, true));
      gesperrtBis = Date.now() + SPERRE_NACH_KOPIEREN_MS;
      kopiert.then((geklappt) => {
        if (geklappt) kopiertZeigen();
        else kopierFehlerZeigen(kategorie);
      });
      break;
    }

    case "nochmals-kopieren": {
      const kategorie = aktuell;
      if (!kategorie) return;
      kopieren(kategorie).then((geklappt) => {
        if (geklappt) kopiertZeigen();
        else kopierFehlerZeigen(kategorie);
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

// Die App auf dem Home-Bildschirm wird beim Zurückkehren nur fortgesetzt, nicht neu geladen.
// Steht dann der Startbildschirm da, wird die Zahl von heute neu gelesen (z.B. nach Mitternacht).
// Nur die Zahl wird ausgetauscht, damit ein gleichzeitiges Antippen nicht gesperrt wird.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") return;
  const zaehler = app.querySelector(".zaehler");
  if (!zaehler) return;
  zaehler.textContent = String(heuteAnzahl(speicher, new Date()));
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
// Beim Start gibt es keinen vorigen Bildschirm, dessen Doppeltipp noch nachwirken könnte:
// Der erste Tipp soll sofort gelten.
gesperrtBis = 0;

// Offline-Betrieb: den Service Worker (sw.js) anmelden. Ein Fehler hier darf die App nie stören.
try {
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
} catch {
  // Ohne Service Worker läuft die App einfach nur online.
}
