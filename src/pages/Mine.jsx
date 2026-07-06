import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";


import {
  ArrowDown,
  ArrowUp,
  ArrowLeftRight,
  RefreshCw,
  History,
  CreditCard,
  BadgeCheck,
  Lock,
  Languages,
  Info,
  LogOut,
  ChevronRight,
  Copy
} from "lucide-react";

import "../styles/mine.css";

import { getWallet } from "../lib/walletApi";

export default function Mine() {

  const navigate = useNavigate();

  const { t } = useTranslation();

  const [wallet,setWallet] = useState(null);

  const [profile,setProfile] = useState(null);

  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    loadWallet();

    window.addEventListener(
      "walletUpdated",
      loadWallet
    );

    return ()=>{

      window.removeEventListener(
        "walletUpdated",
        loadWallet
      );

    };

  },[]);

  async function loadWallet(){

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if(!user) return;

    try{

      const data =
        await getWallet(user.id);

      setWallet(data);

      const { data: profileData, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();

if (!error) {
  setProfile(profileData);
}

    }

    finally{

      setLoading(false);

    }

  }

  function copyInvite(){

    const code = profile?.inviteCode || profile?.invite_code;

if (!code) return;

navigator.clipboard.writeText(code);

    alert(t("inviteCopied"));

  }

  function logout(){

    localStorage.removeItem("user");

    navigate("/login");

  }

  if(loading){

    return(

      <div className="mine-page">

        {t("loading")}

      </div>

    );

  }

  return (

<div className="mine-page">

  <div className="mine-header">

    <h1 className="mine-title">
      Mine
    </h1>

    <button
      className="logout-top-btn"
      onClick={logout}
    >
      <LogOut size={18}/>
      
    </button>

  </div>



{/* ===========================
    Profile Card
=========================== */}

<div className="profile-card">

    <div className="profile-top">

        <div className="avatar">

            {profile?.username?.charAt(0)?.toUpperCase() || "W"}

        </div>

        <div className="profile-info">

            <h2>

                {profile?.first_name} 

            </h2>

            <div className="uid-row">

                UID : {profile?.member_id}

            </div>

        </div>

    </div>

    {/* Invite */}

    <div className="invite-box">

        <div>

            <div className="invite-label">

                {t("inviteCode")}

            </div>

            <div className="invite-code">

                {profile?.inviteCode || profile?.invite_code || ""}

            </div>

        </div>

        <button

        className="copy-btn"

        onClick={copyInvite}

        >

            <Copy size={18}/>

            {t("copy")}

        </button>

    </div>

</div>

{/* ===========================
    Action Buttons
=========================== */}

<div className="action-grid">

<div

className="action-card"

onClick={()=>navigate("/deposit")}

>

<ArrowDown
size={28}
/>

<span>

Deposit

</span>

</div>

<div

className="action-card"

onClick={()=>navigate("/withdraw")}

>

<ArrowUp
size={28}
/>

<span>

Withdraw

</span>

</div>

<div

className="action-card"

onClick={()=>navigate("/transfer")}

>

<ArrowLeftRight
size={28}
/>

<span>

Transfer

</span>

</div>

<div

className="action-card"

onClick={()=>navigate("/convert")}

>

<RefreshCw
size={28}
/>

<span>

Convert

</span>

</div>

</div>

{/* ===========================
    Menu
=========================== */}

<div className="mine-menu">

  {/* ประวัติ */}

  <div
    className="mine-item"
    onClick={() => navigate("/transactions")}
  >

    <div className="mine-left">

      <History
        size={22}
        color="#F5C542"
      />

      <span>{t("transactionRecords")}</span>

    </div>

    <ChevronRight size={18}/>

  </div>

  {/* ธุรกรรมบัญชี */}

  <div
    className="mine-item"
    onClick={() => navigate("/bank-account")}
  >

    <div className="mine-left">

      <CreditCard
        size={22}
        color="#F5C542"
      />

      <span>{t("bankAccounts")}</span>

    </div>

    <ChevronRight size={18}/>

  </div>

  {/* KYC */}

  <div
    className="mine-item"
    onClick={() => navigate("/kyc")}
  >

    <div className="mine-left">

      <BadgeCheck
        size={22}
        color="#F5C542"
      />

      <span>{t("kyc")}</span>

    </div>

    <ChevronRight size={18}/>

  </div>

  {/* เปลี่ยนรหัสผ่าน */}

  <div
    className="mine-item"
    onClick={() => navigate("/change-password")}
  >

    <div className="mine-left">

      <Lock
        size={22}
        color="#F5C542"
      />

      <span>{t("security")}</span>

    </div>

    <ChevronRight size={18}/>

  </div>

  {/* เปลี่ยนภาษา */}

  <div
    className="mine-item"
    onClick={() => navigate("/language")}
  >

    <div className="mine-left">

      <Languages
        size={22}
        color="#F5C542"
      />

      <span>{t("languages")}</span>

    </div>

    <ChevronRight size={18}/>

  </div>

  {/* About */}

  <div
    className="mine-item"
    onClick={() => navigate("/about")}
  >

    <div className="mine-left">

      <Info
        size={22}
        color="#F5C542"
      />

      <span>{t("about")}</span>

    </div>

    <ChevronRight size={18}/>

  </div>

</div>



</div>

);

}