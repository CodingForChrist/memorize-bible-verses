import "./css/tailwind.css";
import "./css/scriptureStyles.css";

import { AppStateProvider } from "./webComponents/appStateProvider";
import { BibleTranslationSelector } from "./webComponents/bibleTranslationSelector";
import { BibleVerseSelector } from "./webComponents/bibleVerseSelector";
import { AccordionContainer } from "./webComponents/accordionContainer";
import { ReciteBibleVerse } from "./webComponents/reciteBibleVerse";
import { AccuracyReport } from "./webComponents/accuracyReport";

async function onLoad() {
  window.customElements.define("app-state-provider", AppStateProvider);
  window.customElements.define(
    "bible-translation-selector",
    BibleTranslationSelector,
  );
  window.customElements.define("bible-verse-selector", BibleVerseSelector);
  window.customElements.define("accordion-container", AccordionContainer);
  window.customElements.define("recite-bible-verse", ReciteBibleVerse);
  window.customElements.define("accuracy-report", AccuracyReport);
}

onLoad();
