import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Copy,
  ArrowDown,
  ArrowUp,
  Repeat2,
  TrendingUp,
  LineChart,
  Landmark,
  Globe,
  Lock,
  BadgeCheck,
  History,
  LogOut,
  ChevronRight,
  Wallet
} from "lucide-react";

import "../styles/assets.css";

import { getProfile } from "../lib/profileApi";
import { getWallet } from "../lib/walletApi";
import { getBank } from "../lib/bankApi";
import { getTradeHistory } from "../lib/tradeApi";

export default function Assets() {

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [banks, setBanks] = useState([]);
  const [trades, setTrades] = useState([]);

  const [historyCount, setHistoryCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [tradingAmount, setTradingAmount] = useState(0);

  useEffect(() => {

    loadData();

    window.addEventListener(
      "walletUpdated",
      loadData
    );

    return () => {

      window.removeEventListener(
        "walletUpdated",
        loadData
      );

    };

  }, []);

  async function loadData() {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) return;

    try {

      const profileData =
        await getProfile(user.id);

      const walletData =
        await getWallet(user.id);

      const bankData =
        await getBank(user.id);

      const tradeData =
        await getTradeHistory(user.id);

      setProfile(profileData);

      setWallet(walletData);

      setBanks(bankData || []);

      setTrades(tradeData || []);

      setHistoryCount((tradeData || []).length);

      const tradingTotal =
  (tradeData || [])
    .filter(item => item.status === "trading")
    .reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

setTradingAmount(tradingTotal);


    } finally {

      setLoading(false);

    }

  }

  function copyInvite() {

    navigator.clipboard.writeText(
      profile?.invite_code || ""
    );

    alert("คัดลอกรหัสเชิญแล้ว");

  }

  const totalProfit =
    trades
      ?.filter(
        item => item.result === "win"
      )
      ?.reduce(
        (sum, item) =>
          sum + Number(item.payout || 0),
        0
      ) || 0;

  return (

    <div className="assets-page">

      {/* ================= Header ================= */}

      <div className="assets-header">

        <div>

          <div className="logo">

            GOLDEX

          </div>

          <div className="welcome">

            Welcome Back

          </div>

        </div>

        

      </div>

      {/* ================= Wallet ================= */}

      <div className="wallet-card">

    <div className="wallet-glow"></div>

    <div className="wallet-top">

  <div className="wallet-user">

    <div className="avatar">

      {profile?.first_name
        ?.charAt(0)
        ?.toUpperCase() || "U"}

    </div>

    <div className="user-info">

      <h2 className="username">

        {profile?.first_name} {profile?.last_name}

      </h2>

      <div className="uid-row">

        <span className="uid">

          UID : {profile?.member_id || "-"}

        </span>

        <button
          className="uid-copy"
          onClick={() =>
            navigator.clipboard.writeText(
              profile?.member_id || ""
            )
          }
        >

          <Copy size={15} />

        </button>

      </div>

    </div>

  </div>

</div>

        {/* Invite */}

        <div className="invite-card">

    <div className="invite-left">

        

        <div>

            <div className="invite-title">

                รหัสเชิญ

            </div>

            <div className="invite-code">

                {profile?.invite_code || "-"}

            </div>

        </div>

    </div>

    <button
        className="invite-copy-btn"
        onClick={copyInvite}
    >

        <Copy size={18}/>

        <span>

            คัดลอก

        </span>

    </button>

</div>

        {/* Balance */}

        {/* ================= Balance ================= */}

<div className="balance-grid">

  <div className="balance-item">

    <div className="balance-circle wallet-circle">

      <Wallet size={28}/>

    </div>

    <div>

      <div className="balance-label">

        ยอดเงินทั้งหมด

      </div>

      <div className="balance-number">

        USDT {Number(wallet?.balance || 0).toLocaleString()}

      </div>

    </div>

  </div>

  <div className="balance-item">

    <div className="balance-circle profit-circle">

      <TrendingUp size={28}/>

    </div>

    <div>

      <div className="balance-label">

        กำไรสะสม

      </div>

      <div className="profit-number">

        USDT {Number(totalProfit || 0).toLocaleString()}

      </div>

    </div>

  </div>

</div>

      </div>

            {/* ================= Quick Action ================= */}

      <div className="home-actions">

    <div
        className="home-action-card"
        onClick={()=>navigate("/deposit")}
    >

        <ArrowDown size={34}/>

        <span>

            Deposit

        </span>

    </div>

    <div
        className="home-action-card"
        onClick={()=>navigate("/withdraw")}
    >

        <ArrowUp size={34}/>

        <span>

            Withdraw

        </span>

    </div>

    <div
        className="home-action-card"
        onClick={()=>navigate("/transfer")}
    >

        <Repeat2 size={34}/>

        <span>

            Transfer

        </span>

    </div>

</div>

      {/* ================= Menu ================= */}

      <div className="menu-list">

              {/* ================= กำลังเทรด ================= */}

        <div className="menu-card">

          <div className="menu-icon trade">
            <LineChart size={26}/>
          </div>

          <div className="menu-content row">

    <h3>
        กำลังเทรด
    </h3>

    <strong>
  USDT {Number(tradingAmount).toLocaleString()}
</strong>

</div>

          

        

          

        </div>

        {/* ================= ประวัติ ================= */}

        <div
          className="menu-card"
          onClick={() => navigate("/transactions")}
        >

          <div className="menu-icon history">
            <History size={26}/>
          </div>

          <div className="menu-content row">

    <h3>ประวัติ</h3>

    <strong>
        {historyCount} รายการ
    </strong>

</div>
          

        </div>

        {/* ================= ภาษา ================= */}

        <div
  className="menu-card"
  onClick={() => navigate("/language")}
>

  <div className="menu-icon language">
    <Globe size={26}/>
  </div>

  <div className="menu-content">

    <h3>
      เปลี่ยนภาษา
    </h3>

  </div>

  <ChevronRight size={20}/>

</div>

                {/* ================= เปลี่ยนรหัสผ่าน ================= */}

        <div
          className="menu-card"
          onClick={() => navigate("/change-password")}
        >

          <div className="menu-icon password">
            <Lock size={26}/>
          </div>

          <div className="menu-content">

            <h3>
              เปลี่ยนรหัสผ่าน
            </h3>

            

          </div>

          <ChevronRight size={20}/>

        </div>

        {/* ================= ผูกบัญชีธนาคาร ================= */}

        <div
          className="menu-card"
          onClick={() => navigate("/bank-account")}
        >

          <div className="menu-icon bank">
            <Landmark size={26}/>
          </div>

          <div className="menu-content">

            <h3>
              ธุรกรรมบัญชี
            </h3>

            

          </div>

          <ChevronRight size={20}/>

        </div>

        {/* ================= KYC ================= */}

        <div
  className="menu-card"
  onClick={() => navigate("/kyc")}
>

          <div className="menu-icon kyc">
            <BadgeCheck size={26}/>
          </div>

          <div className="menu-content">

            <h3>
              KYC
            </h3>

            

          </div>

          <ChevronRight size={20}/>

        </div>

        {/* ================= Logout ================= */}

        <div
          className="menu-card logout-card"
          onClick={() => {

    localStorage.removeItem("user");

    navigate("/login");

}}
        >

          <div className="menu-icon logout">
            <LogOut size={26}/>
          </div>

          <div className="menu-content">

            <h3>
              Log out
            </h3>

            

          </div>

          <ChevronRight size={20}/>

        </div>

      </div>

      <div style={{ height: 30 }} />

    </div>

  );

}