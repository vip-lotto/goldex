import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock, FaGlobeAsia } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";


import loginBg from "../assets/login01.png";

import "../styles/login.css";

import { Headset } from "lucide-react";


import { supabase } from "../lib/supabase";

import { useToast } from "../context/ToastContext";

export default function Login() {

  const navigate = useNavigate();

  const { showToast } = useToast();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);

  const [showLang,setShowLang] = useState(false);

  const [loading,setLoading] = useState(false);

  

  const { t, i18n } = useTranslation();

  

  const changeLanguage = (value) => {

  i18n.changeLanguage(value);

  localStorage.setItem("language", value);

  setShowLang(false);

};

  const login = async () => {

    if(!username || !password){
      showToast(
    t("fillLogin"),
    "warning"
);
      return;
    }

    setLoading(true);

    const { data,error } = await supabase
      .from("profiles")
      .select("*");

    if(error){
      setLoading(false);
      showToast(
    error.message,
    "error"
);
      return;
    }

    const user = data.find(
      item =>
      (
        item.phone === username ||
        item.email === username ||
        item.first_name === username ||
        `${item.first_name} ${item.last_name}` === username ||
        String(item.member_id) === username
      )
      &&
      item.password === password
    );

    if(!user){
      setLoading(false);

      showToast(
    t("loginFailMessage"),
    "error"
);

      return;
    }

    // เก็บข้อมูลผู้ใช้
localStorage.setItem(
  "user",
  JSON.stringify(user)
);

// โหลดข้อมูลกระเป๋าเงิน (ยอดเงิน)
const { data: wallet } = await supabase
  .from("wallets")
  .select("*")
  .eq("user_id", user.id)
  .single();

localStorage.setItem(
  "wallet",
  JSON.stringify(wallet)
);

// โหลดกระเป๋าคริปโต
const { data: userWallets } = await supabase
  .from("user_wallets")
  .select("*")
  .eq("user_id", user.id);

localStorage.setItem(
  "user_wallets",
  JSON.stringify(userWallets || [])
);

// โหลดบัญชีธนาคาร
const { data: bankAccounts } = await supabase
  .from("bank_accounts")
  .select("*")
  .eq("user_id", user.id);

localStorage.setItem(
  "bank_accounts",
  JSON.stringify(bankAccounts || [])
);

// โหลด Settings
const { data: settings } = await supabase
  .from("settings")
  .select("*")
  .eq("user_id", user.id)
  .single();

localStorage.setItem(
  "settings",
  JSON.stringify(settings || {})
);

// โหลด Notifications
const { data: notifications } = await supabase
  .from("notifications")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

localStorage.setItem(
  "notifications",
  JSON.stringify(notifications || [])
);

setLoading(false);

showToast(
  "เข้าสู่ระบบสำเร็จ",
  "success"
);

setTimeout(() => {
  navigate("/home");
}, 200);
  };

  return (
    <>
      <div
        style={{
          minHeight:"100vh",
          backgroundImage:`url(${loginBg})`,
          backgroundSize:"cover",
          backgroundPosition:"center",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          padding:"20px",
          fontFamily:"Prompt"
        }}
      >


        <button
  onClick={() =>
    window.open(
      "https://lin.ee/nFNwIxfr",
      "_blank"
    )
  }
  style={{
    position:"absolute",
    top:"25px",
    left:"25px",
    width:"60px",
    height:"60px",
    borderRadius:"50%",
    border:"2px solid #facc15",
    background:"rgba(0,0,0,.45)",
    color:"#facc15",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    cursor:"pointer",
    zIndex:999
  }}
>
  <Headset size={24}/>
</button>


        {/* ภาษา */}

        <div
  style={{
    position:"absolute",
    top:"25px",
    right:"25px",
    zIndex:999,
    display:"flex",
    gap:"12px"
  }}
>

  <button
    onClick={() => setShowLang(!showLang)}
    style={{
      width:"60px",
      height:"60px",
      borderRadius:"50%",
      border:"2px solid #facc15",
      background:"rgba(0,0,0,.45)",
      color:"#facc15",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      cursor:"pointer"
    }}
  >
    <FaGlobeAsia size={24}/>
  </button>

  





          {
            showLang && (
              <div
                style={{
                  marginTop:"10px",
                  width:"240px",
                  background:"rgba(10,15,30,.96)",
                  border:"1px solid #facc15",
                  borderRadius:"20px",
                  overflow:"hidden",
                  backdropFilter:"blur(15px)"
                }}
              >

                {[
                  
                  
  ["en","🇺🇸 English"],
  ["th","🇹🇭 ไทย"],
  ["vi","🇻🇳 Tiếng Việt"],
  ["ja","🇯🇵 日本語"],
  ["ko","🇰🇷 한국어"],
  ["zh-TW","🇹🇼 繁體中文"],
  ["zh-CN","🇨🇳 简体中文"],
  ["fr","🇫🇷 Français"],
  ["de","🇩🇪 Deutsch"],
  ["es","🇪🇸 Español"],
  ["ru","🇷🇺 Русский"]


                ].map(([code,name]) => (

                  <div
                    key={code}
                    onClick={() => changeLanguage(code)}
                    style={{
                      padding:"14px 18px",
                      color:"#fff",
                      cursor:"pointer",
                      borderBottom:"1px solid rgba(255,255,255,.05)"
                    }}
                  >
                    {name}
                  </div>

                ))}

              </div>
            )
          }

        </div>

        {/* Card */}

        <div
          style={{
            width:"100%",
            maxWidth:"700px",
            background:"rgba(5,10,25,.75)",
            backdropFilter:"blur(12px)",
            border:"1px solid rgba(250,204,21,.3)",
            borderRadius:"35px",
            padding:"50px"
          }}
        >

          <div className="goldex-title">
            TRUST
          </div>

          <div
            style={{
              textAlign:"center",
              color:"#cfcfcf",
              marginBottom:"35px",
              letterSpacing:"3px"
            }}
          >
            BEST CRYPTO WALLET
          </div>

          {/* USER */}

          <div
            style={{
              display:"flex",
              alignItems:"center",
              background:"rgba(255,255,255,.05)",
              border:"1px solid rgba(255,255,255,.15)",
              borderRadius:"18px",
              padding:"0 18px",
              marginBottom:"18px"
            }}
          >
            <FaUserAlt color="#ddd" />

            <input
              placeholder={t("username")}
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              style={{
                flex:1,
                background:"transparent",
                border:"none",
                color:"#fff",
                padding:"18px",
                fontSize:"18px",
                outline:"none"
              }}
            />
          </div>

          {/* PASSWORD */}

          <div
            style={{
              display:"flex",
              alignItems:"center",
              background:"rgba(255,255,255,.05)",
              border:"1px solid rgba(255,255,255,.15)",
              borderRadius:"18px",
              padding:"0 18px"
            }}
          >
            <FaLock color="#ddd" />

            <input
              type={
                showPassword
                ? "text"
                : "password"
              }
              placeholder={t("password")}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              style={{
                flex:1,
                background:"transparent",
                border:"none",
                color:"#fff",
                padding:"18px",
                fontSize:"18px",
                outline:"none"
              }}
            />

            <IoEyeOutline
              size={26}
              color="#ddd"
              style={{cursor:"pointer"}}
              onClick={() =>
                setShowPassword(!showPassword)
              }
            />
          </div>

          {/* LOGIN */}

          <button
            onClick={login}
            disabled={loading}
            style={{
              width:"100%",
              marginTop:"25px",
              padding:"18px",
              border:"none",
              borderRadius:"18px",
              background:
                "linear-gradient(90deg,#ffd54f,#d4a017)",
              fontSize:"28px",
              fontWeight:"700",
              cursor:"pointer"
            }}
          >
            {
              loading
  ? t("loading")
  : t("login")
            }
          </button>

          {/* REGISTER */}

          <button
            onClick={() => navigate("/register")}
            style={{
              width:"100%",
              marginTop:"18px",
              padding:"18px",
              borderRadius:"18px",
              background:"transparent",
              border:"2px solid #d4a017",
              color:"#d4a017",
              fontSize:"24px",
              fontWeight:"700",
              cursor:"pointer"
            }}
          >
            {t("register")}
          </button>

          <div
            style={{
              textAlign:"center",
              color:"#aaa",
              marginTop:"30px",
              fontSize:"18px"
            }}
          >
            🛡️ {t("secure")}
          </div>

        </div>
      </div>

      
    </>
  );
}