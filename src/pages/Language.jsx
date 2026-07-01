import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import "../styles/language.css";

const languages = [
  { code: "th", short: "TH", name: "ไทย" },
  { code: "en", short: "US", name: "English" },
  { code: "vi", short: "VN", name: "Tiếng Việt" },
  { code: "ja", short: "JP", name: "日本語" },
  { code: "ko", short: "KR", name: "한국어" },
  { code: "zh-TW", short: "TW", name: "繁體中文" },
  { code: "zh-CN", short: "CN", name: "简体中文" },
  { code: "fr", short: "FR", name: "Français" },
  { code: "de", short: "DE", name: "Deutsch" },
  { code: "es", short: "ES", name: "Español" },
  { code: "ru", short: "RU", name: "Русский" }
];

export default function Language() {

  const navigate = useNavigate();

  const current =
    localStorage.getItem("lang") || "th";

  function changeLanguage(code){

    localStorage.setItem("lang",code);

    window.dispatchEvent(
      new Event("languageChanged")
    );

    navigate(-1);

  }

  return (

    <div className="language-page">

      <div className="language-header">

        <button
          className="back-btn"
          onClick={()=>navigate(-1)}
        >

          <ArrowLeft size={22}/>

        </button>

        <h2>

          เลือกภาษา

        </h2>

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