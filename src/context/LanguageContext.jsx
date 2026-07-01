import { createContext, useContext, useEffect, useState } from "react";
import { language } from "../data/language";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {

  const [lang, setLang] = useState(
    localStorage.getItem("lang") || "th"
  );

  useEffect(() => {

    function updateLanguage() {

      setLang(
        localStorage.getItem("lang") || "th"
      );

    }

    window.addEventListener(
      "languageChanged",
      updateLanguage
    );

    return () => {

      window.removeEventListener(
        "languageChanged",
        updateLanguage
      );

    };

  }, []);

  return (

    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t: language[lang] || language.th
      }}
    >

      {children}

    </LanguageContext.Provider>

  );

}

export function useLanguage() {

  return useContext(LanguageContext);

}