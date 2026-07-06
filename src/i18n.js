import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import th from "./locales/th.json";
import vi from "./locales/vi.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import ru from "./locales/ru.json";

const savedLanguage = localStorage.getItem("language") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      th: { translation: th },
      vi: { translation: vi },
      ja: { translation: ja },
      ko: { translation: ko },
      "zh-CN": { translation: zhCN },
      "zh-TW": { translation: zhTW },
      fr: { translation: fr },
      de: { translation: de },
      es: { translation: es },
      ru: { translation: ru },
    },

    lng: savedLanguage,
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

  console.log("Saved Language =", savedLanguage);

console.log("EN keys =", Object.keys(en).length);
console.log("TH keys =", Object.keys(th).length);

console.log("TH mine =", th.mine);
console.log("TH inviteCode =", th.inviteCode);
console.log("TH security =", th.security);
console.log("TH languages =", th.languages);
console.log("TH about =", th.about);

export default i18n;