import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../styles/language.css";

const languages = [
  
  { code: "en", short: "US", name: "English" },
  {code: "th", short: "TH", name: "ไทย" },
  { code: "vi", short: "VN", name: "Tiếng Việt" },
  { code: "ja", short: "JP", name: "日本語" },
  { code: "ko", short: "KO", name: "한국어" },
  { code: "zh-TW", short: "TW", name: "繁體中文" },
  { code: "zh-CN", short: "CN", name: "简体中文" },
  { code: "fr", short: "FR", name: "Français" },
  { code: "de", short: "DE", name: "Deutsch" },
  { code: "es", short: "ES", name: "Español" },
  { code: "ru", short: "RU", name: "Русский" }
];

export default function Language() {

  const navigate = useNavigate();
const { t, i18n } = useTranslation();

const current = i18n.language;

console.log("Current Language =", current);

  function changeLanguage(code) {

  console.log("Click =", code);

  i18n.changeLanguage(code);

  localStorage.setItem("language", code);

  console.log("Current =", i18n.language);
  console.log("Storage =", localStorage.getItem("language"));

  navigate(-1);

}

  return (

    <div className="language-page">

      <div className="language-header">

  <button
    className="back-btn"
    onClick={() => navigate(-1)}
  >
    <ArrowLeft size={22}/>
  </button>

  <div className="language-title">

    <h1>{t("language")}</h1>

  </div>

  <div className="header-space"></div>

</div>

      <div className="language-card">

        {

          languages.map(item=>(

            <div

              key={item.code}

              className={
                current===item.code
                ? "language-item active"
                : "language-item"
              }

              onClick={()=>
                changeLanguage(item.code)
              }

            >

              <div className="language-left">

                <span className="language-short">

                  {item.short}

                </span>

                <span className="language-name">

                  {item.name}

                </span>

              </div>

              {

                current===item.code &&

                <Check
                  size={22}
                  color="#FFD54A"
                />

              }

            </div>

          ))

        }

      </div>

    </div>

  );

}