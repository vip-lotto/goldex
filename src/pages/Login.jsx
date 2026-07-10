import { useState, useEffect } from "react";

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

  const [contacts,setContacts] = useState([]);
  const [showContacts,setShowContacts] = useState(false);

  const [loading,setLoading] = useState(false);

  

  const { t, i18n } = useTranslation();

  

  const changeLanguage = (value) => {

  i18n.changeLanguage(value);

  localStorage.setItem("language", value);

  setShowLang(false);

};

const loadContacts = async () => {

  const { data, error } = await supabase
    .from("admin_contacts")
    .select("*")
    .eq("enabled", true);

  if(error){
    console.log(error);
    return;
  }

  setContacts(data || []);

};

useEffect(()=>{

  loadContacts();

},[]);

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
  t("loginSuccess"),
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
className="top-support-btn"
onClick={()=>setShowContacts(true)}
>

<Headset size={20}/>

<span>
Support
</span>

</button>


        {/* ภาษา */}

        {/* ภาษา */}
<div className="language-box">

<button
className="top-language-btn"

onClick={() => setShowLang(!showLang)}
>

<FaGlobeAsia size={18}/>

<span>
EN 
</span>

<span>
▼
</span>

</button>

  





          {
            showLang && (
              <div
style={{
position:"absolute",
top:"55px",
right:"0",
width:"240px",
background:"rgba(10,15,30,.96)",
border:"1px solid #158bfa",
borderRadius:"20px",
overflow:"hidden",
backdropFilter:"blur(15px)",
zIndex:9999
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
                minWidth:0,
                width:"100%",
                background:"transparent",
                border:"none",
                color:"#fff",
                padding:"18px 10px",
                fontSize:"clamp(13px,3.5vw,14px)",
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
                minWidth:0,
                width:"100%",
                background:"transparent",
                border:"none",
                color:"#fff",
                padding:"18px 10px",
                fontSize:"clamp(13px,3.5vw,14px)",
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
              "linear-gradient(90deg,#00b8ff,#006dff)",
              color:"#fff",
              boxShadow:"0 0 25px rgba(0,170,255,.45)",
              fontSize:"20px",
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
              border:"2px solid #1da1ff",
              color:"#4fdcff",
              background:"rgba(12,30,60,.45)",
              fontSize:"20px",
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

      {
showContacts && (

<div

onClick={()=>setShowContacts(false)}

style={{
position:"fixed",
inset:0,
background:"rgba(0,0,0,.65)",
backdropFilter:"blur(10px)",
display:"flex",
justifyContent:"center",
alignItems:"center",
zIndex:99999
}}

>


<div

onClick={(e)=>e.stopPropagation()}

style={{

width:"360px",
maxWidth:"90%",
background:
"linear-gradient(180deg,#172b47,#0b1628)",
borderRadius:"22px",
padding:"25px"

}}

>


<h3

style={{
color:"#fff",
textAlign:"center",
marginBottom:"20px"
}}

>

Customer Service

</h3>


{
contacts.map(contact=>(


<div

key={contact.id}

onClick={()=>{

const url =
contact.link
?
(
contact.link.startsWith("http")
?
contact.link
:
`https://${contact.link}`
)
:
"#";


window.open(url,"_blank");

}}

style={{

height:"90px",
background:"rgba(255,255,255,.06)",
borderRadius:"15px",
display:"flex",
alignItems:"center",
gap:"15px",
padding:"15px",
marginBottom:"20px",
cursor:"pointer"

}}

>


<img

src={contact.icon_url}

style={{

width:"60px",
height:"60px",
borderRadius:"15px",
background:"#fff",
objectFit:"contain"

}}

/>


<span

style={{
color:"#fff",
fontWeight:"600"
}}

>

{contact.name}

</span>


</div>


))
}



<button

onClick={()=>setShowContacts(false)}

style={{

width:"100%",
height:"50px",
border:"none",
borderRadius:"12px",
background:"#c84d43",
color:"#fff",
fontWeight:"700",
fontSize:"16px"

}}

>

Close

</button>


</div>


</div>

)
}

      
    </>
  );
}