
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import loginBg from "../assets/login01.png";

import {
  User,
  Mail,
  Phone,
  Lock,
  Gift,
  Globe
} from "lucide-react";

import { useToast } from "../context/ToastContext";
import { language } from "../data/language";

import "../styles/register.css";

export default function Register() {

  const navigate = useNavigate();

  const { showToast } = useToast();


  const [lang] = useState(
    localStorage.getItem("lang") || "th"
  );

  const t = language[lang];

  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [phone,setPhone] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [inviteCode,setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  

  

  const register = async () => {

    if (loading) return;

    setLoading(true);

  if (
    !firstName ||
    !lastName ||
    !phone ||
    !password
  ) {

    showToast(
  t.fillAll,
  "warning"
);

setLoading(false);

    return;
  }

  if (
    password !== confirmPassword
  ) {

    showToast(
  t.passwordNotMatch,
  "warning"
);

setLoading(false);
    return;
  }

  let memberId;
let memberExist = true;

while (memberExist) {

  memberId =
  Math.floor(10000000 + Math.random() * 90000000);

  const {
  data,
  error
} = await supabase
  .from("profiles")
  .select("id")
  .eq("member_id", memberId);

if (error) {

  showToast(
    error.message,
    "error"
  );

  setLoading(false);

  return;

}

memberExist = data.length > 0;
}

    let query = supabase
  .from("profiles")
  .select("id");

if (email) {

  query = query.or(
    `phone.eq.${phone},email.eq.${email}`
  );

} else {

  query = query.eq(
    "phone",
    phone
  );

}



const {
  data: existUser,
  error: existError
} = await query;

if (existError) {

  showToast(
    existError.message,
    "error"
  );

  setLoading(false);

  return;

}

if (existUser && existUser.length > 0) {

  showToast(
    "เบอร์โทรหรืออีเมลนี้ถูกใช้งานแล้ว",
    "warning"
  );

  setLoading(false);

  return;

}

  

  let myInviteCode = "";
let inviteExist = true;

while (inviteExist) {

  myInviteCode =
    "GX" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

  const {
    data,
    error
  } = await supabase
    .from("profiles")
    .select("id")
    .eq("invite_code", myInviteCode);

  if (error) {

    showToast(
      error.message,
      "error"
    );

    setLoading(false);

    return;

  }

  inviteExist = data.length > 0;

}

const {
  data: profile,
  error
} = await supabase
    .from("profiles")
    .insert([
  {
    member_id: memberId,
    first_name: firstName,
    last_name: lastName,
    phone,
    email,
    password,
    invite_code: myInviteCode,

referrer_code:
  inviteCode.trim() || null,

balance: 0
  }
])
    .select()
    .single();

  if(error){

  

  showToast(
    error.message,
    "error"
  );

  setLoading(false);

  return;
}

  const userId =
    profile.id;

  const { error: walletError } =
await supabase
  .from("wallets")
  .insert({
    user_id: userId,
    balance: 0
  });

if (walletError) {

  showToast(
    walletError.message,
    "error"
  );

  setLoading(false);

  return;
}

  const {
  data: templates,
  error: templateError
} = await supabase
  .from("deposit_wallets")
  .select("*");

  if (templateError) {

  showToast(
    templateError.message,
    "error"
  );

  setLoading(false);

  return;
}




  if (
    templates &&
    templates.length > 0
  ) {

    const userWallets =
      templates.map(item => ({

        user_id:
          userId,

        coin:
          item.coin,

        network:
          item.network,

        address:
          `TX${userId}${item.coin}${item.network}${Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()}`

      }));

    const {
  error: walletError
} = await supabase
  .from("user_wallets")
  .insert(userWallets);

if (walletError) {

  showToast(walletError.message,"error");

  setLoading(false);

  return;

}


/*
const {
  error: settingsError
} = await supabase
  .from("settings")
  .insert({
    user_id: userId,
    language: "th",
    region: "TH",
    cloud_sync: true,
    dark_mode: true,
  });

if (settingsError) {

  showToast(settingsError.message,"error");

  setLoading(false);

  return;

}

*/

const { error: notifyError } = await supabase
  .from("notifications")
  .insert({
    user_id: userId,
    title: "ยินดีต้อนรับ",
    message: "ยินดีต้อนรับเข้าสู่ GOLDEX",
    is_read: false
  });

if (notifyError) {
  console.log(notifyError);
}
  





  }

  setLoading(false);




showToast(
  t.registerSuccessMessage,
  "success"
);

localStorage.removeItem("wallets");
localStorage.removeItem("user");

// ล้างข้อมูล
setFirstName("");
setLastName("");
setPhone("");
setEmail("");
setPassword("");
setConfirmPassword("");
setInviteCode("");

setTimeout(() => {
  navigate("/", {
    replace: true
  });
}, 800);

};

  return (
    <>
      <div
        className="register-page"
        style={{
          backgroundImage:`url(${loginBg})`
        }}
      >

        <button
          className="language-btn"
          type="button"
        >
          <Globe size={28}/>
        </button>

        <div className="register-card">

          <div className="register-title">
            GOLDEX
          </div>

          <div className="register-sub">
            CREATE YOUR TRADING ACCOUNT
          </div>

          <div className="input-group">
            <User size={20}/>
            <input
              className="register-input"
              placeholder={t.firstName}
              value={firstName}
              onChange={(e)=>
                setFirstName(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <User size={20}/>
            <input
              className="register-input"
              placeholder={t.lastName}
              value={lastName}
              onChange={(e)=>
                setLastName(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <Phone size={20}/>
            <input
              className="register-input"
              placeholder={t.phone}
              value={phone}
              onChange={(e)=>
                setPhone(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <Mail size={20}/>
            <input
              className="register-input"
              placeholder={t.email}
              value={email}
              onChange={(e)=>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <Lock size={20}/>
            <input
              type="password"
              className="register-input"
              placeholder={t.password}
              value={password}
              onChange={(e)=>
                setPassword(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <Lock size={20}/>
            <input
              type="password"
              className="register-input"
              placeholder={t.confirmPassword}
              value={confirmPassword}
              onChange={(e)=>
                setConfirmPassword(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <Gift size={20}/>
            <input
              className="register-input"
              placeholder={t.inviteCode}
              value={inviteCode}
              onChange={(e)=>
                setInviteCode(e.target.value)
              }
            />
          </div>

          <button
  className="register-btn"
  onClick={register}
  disabled={loading}
>
            {
  loading
    ? "Loading..."
    : t.register
}
          </button>

          <button
  className="login-back-btn"
  onClick={() => navigate("/")}
  disabled={loading}
>
  {t.login}
</button>

          <div className="register-footer">
            <span>26.07.01</span>
            <br/>
            Secure • Stable • Trustworthy
          </div>

        </div>

      </div>

      
    </>
  );
}


