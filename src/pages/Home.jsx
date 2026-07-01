import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
ArrowDownToLine,
ArrowUpFromLine,
ArrowLeftRight,
Bell,
} from "lucide-react";

import { supabase } from "../lib/supabase";

import BannerSlider from "../components/BannerSlider";
import BottomNav from "../components/BottomNav";
import HomeMarketChart from "../components/HomeMarketChart";

import "../styles/home.css";

export default function Home() {

const navigate = useNavigate();

const [coins, setCoins] = useState([]);
const [activeTab, setActiveTab] =
useState("trending");
const [walletBalance, setWalletBalance] =
useState(0);

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
      icon: "🟠",
      price:
        data.bitcoin.usd,
      change:
        data.bitcoin.usd_24h_change,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      icon: "🔷",
      price:
        data.ethereum.usd,
      change:
        data.ethereum.usd_24h_change,
    },
    {
      symbol: "SOL",
      name: "Solana",
      icon: "🟣",
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

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  console.log("USER =", user);

  if (!user) return;

  const { data, error } =
    await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id);

  console.log("DATA =", data);
  console.log("ERROR =", error);

  if (
    data &&
    data.length > 0
  ) {

    setWalletBalance(
      Number(
        data[0].balance || 0
      )
    );

  }

};

useEffect(() => {

  loadMarket();
  loadNotifications();
  loadWallet();

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


return (


<div className="home-page">

  <div className="home-header">

    <h1>GOLDEX</h1>

    <div
      className="notify-btn"
      onClick={() =>
        navigate(
          "/notifications"
        )
      }
    >

      <Bell size={26} />

      {unreadCount > 0 && (

        <span
          className="notify-badge"
        >
          {
            unreadCount > 99
              ? "99+"
              : unreadCount
          }
        </span>

      )}

    </div>

  </div>

  <BannerSlider />

  <div className="asset-card">

    <div>

      <span>
        Assets
      </span>

      <h2>
        {walletBalance.toLocaleString()}
        {" "}USDT
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
      onClick={() =>
        navigate(
          "/deposit"
        )
      }
    >
      <ArrowDownToLine size={32}/>
      <p>Depocit</p>
    </div>

    <div
      className="action-box"
      onClick={() =>
        navigate(
          "/withdraw"
        )
      }
    >
      <ArrowUpFromLine size={32}/>
      <p>Withdraw</p>
    </div>

    <div
      className="action-box"
      onClick={() =>
        navigate(
          "/transfer"
        )
      }
    >
      <ArrowLeftRight size={32}/>
      <p>Transfer</p>
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

          <h3>
            {coin.icon} {coin.symbol}
          </h3>

          <span>
            {coin.name}
          </span>

        </div>

        <div className="market-right">

          <h3>
            $
            {Number(coin.price).toLocaleString()}
          </h3>

          <span
            className={
              coin.change > 0
                ? "green"
                : "red"
            }
          >
            ▲ {coin.change.toFixed(2)}%
          </span>

        </div>

      </div>

    ))}

</div>

  <BottomNav />

</div>


);
}

