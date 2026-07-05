import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
ArrowDownToLine,
ArrowUpFromLine,
ArrowLeftRight,
RefreshCcw,
Bell,
Headset
} from "lucide-react";

import { supabase } from "../lib/supabase";

import { getWallet } from "../lib/walletApi";
import { getExchangeRates } from "../lib/convertApi";


import BannerSlider from "../components/BannerSlider";
import BottomNav from "../components/BottomNav";
import HomeMarketChart from "../components/HomeMarketChart";

import "../styles/home.css";

export default function Home() {

const navigate = useNavigate();

const [coins, setCoins] = useState([]);
const [activeTab, setActiveTab] =
useState("trending");


const [wallet, setWallet] = useState(null);
const [rates, setRates] = useState([]);

const [unreadCount,
setUnreadCount] =
useState(0);

const loadNotifications =
  async () => {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (!user) return;

    const { count } =
      await supabase
        .from("notifications")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "is_read",
          false
        );

    setUnreadCount(
      count || 0
    );

};

const loadMarket =
async () => {


try {

  const res =
    await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true"
    );

  const data =
    await res.json();

  setCoins([
    
      {
  symbol: "BTC",
  name: "Bitcoin",
  logo: "/coins/btc.png",
      price:
        data.bitcoin.usd,
      change:
        data.bitcoin.usd_24h_change,
    },
    {
      
  symbol: "ETH",
  name: "Ethereum",
  logo: "/coins/eth.png",
      price:
        data.ethereum.usd,
      change:
        data.ethereum.usd_24h_change,
    },
    {
  symbol: "SOL",
  name: "Solana",
  logo: "/coins/sol.png",
      price:
        data.solana.usd,
      change:
        data.solana.usd_24h_change,
    },
  ]);

} catch (err) {

  console.log(err);

}


};

const loadWallet = async () => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) return;

  const walletData =
    await getWallet(user.id);

  setWallet(walletData);

};

const loadRates = async () => {

  const rateData =
    await getExchangeRates();

  setRates(rateData || []);

};

useEffect(() => {

loadMarket();
loadNotifications();
loadWallet();
loadRates();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const channel =
    supabase
      .channel(
        "notifications-realtime"
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {

          if (
            payload.new.user_id ===
            user?.id
          ) {

            loadNotifications();

          }

        }
      )
      .subscribe();

  const interval =
  setInterval(() => {

    loadMarket();
    loadWallet();
    loadRates();

  }, 30000);

  return () => {

    clearInterval(
      interval
    );

    supabase.removeChannel(
      channel
    );

  };

}, []);






// ===== เพิ่มตรงนี้ =====



const totalAssets = useMemo(() => {

  if (!wallet || rates.length === 0) return 0;

  const usdtBalance = Number(wallet.balance || 0);

  const otherAssets = rates
    .filter(rate => rate.symbol !== "USDT")
    .reduce((sum, rate) => {

      const amount = Number(wallet[rate.symbol] || 0);

      return sum + amount * Number(rate.rate || 0);

    }, 0);

  return usdtBalance + otherAssets;

}, [wallet, rates]);

// ===== จบที่เพิ่ม =====

return (

<div className="home-page">

  <div className="home-header">

    <h1>TRUST</h1>

    <div className="header-actions">

        <div
            className="support-btn"
            onClick={() =>
                window.open(
                    "https://lin.ee/nFNwIxfr",
                    "_blank"
                )
            }
        >
            <Headset size={24}/>
        </div>

        <div
            className="notify-btn"
            onClick={() =>
                navigate("/notifications")
            }
        >

            <Bell size={26}/>

            {unreadCount > 0 && (

                <span className="notify-badge">

                    {unreadCount > 99
                        ? "99+"
                        : unreadCount}

                </span>

            )}

        </div>

    </div>

</div>

  <BannerSlider />

  <div className="asset-card">

    <div>

      <span>
        Assets
      </span>

      <h2>
  {totalAssets.toLocaleString(undefined,{
    minimumFractionDigits:2,
    maximumFractionDigits:2
  })}{" "}
  USDT
</h2>

    </div>

    <div>

      <span>
        Profit
      </span>

      <h3 className="green">
        +$326.44
      </h3>

    </div>

  </div>

  <div className="action-grid">

  <div
    className="action-box"
    onClick={() => navigate("/deposit")}
  >
    <ArrowDownToLine size={30}/>
    <p>Deposit</p>
  </div>

  <div
    className="action-box"
    onClick={() => navigate("/withdraw")}
  >
    <ArrowUpFromLine size={30}/>
    <p>Withdraw</p>
  </div>

  <div
    className="action-box"
    onClick={() => navigate("/transfer")}
  >
    <ArrowLeftRight size={30}/>
    <p>Transfer</p>
  </div>

  <div
    className="action-box"
    onClick={() => navigate("/convert")}
  >
    <RefreshCcw size={30}/>
    <p>Convert</p>
  </div>

</div>

  <div className="gold-section">

  <HomeMarketChart />

</div>

  <div className="market-tabs">

    <button
      className={
        activeTab ===
        "trending"
          ? "tab-btn active"
          : "tab-btn"
      }
      onClick={() =>
        setActiveTab(
          "trending"
        )
      }
    >
      Trending
    </button>

    <button
      className={
        activeTab ===
        "hot"
          ? "tab-btn active"
          : "tab-btn"
      }
      onClick={() =>
        setActiveTab(
          "hot"
        )
      }
    >
      Hot Markets
    </button>

  </div>

  <div className="market-section">

  {activeTab === "trending" &&
    coins.map((coin) => (

      <div
    className="market-row"
    key={coin.symbol}
>

    <div className="market-left">

        <img
            src={coin.logo}
            alt={coin.symbol}
            className="market-logo"
        />

        <div className="market-info">

    <div className="market-symbol">
        {coin.symbol}
    </div>

    <div className="market-name">
        {coin.name}
    </div>

</div>

    </div>

    <div className="market-right">

        <div className="market-price">
            ${Number(coin.price).toLocaleString()}
        </div>

        <div
            className={
                coin.change > 0
                    ? "market-change green"
                    : "market-change red"
            }
        >
            ▲ {coin.change.toFixed(2)}%
        </div>

    </div>

</div>

    ))}

</div>

  <BottomNav />

</div>


);
}

