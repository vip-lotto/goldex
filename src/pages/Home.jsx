import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  RefreshCcw,
  Bell,
  Headset,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import { getWallet } from "../lib/walletApi";
import { getExchangeRates } from "../lib/convertApi";

import BannerSlider from "../components/BannerSlider";
import HomeMarketChart from "../components/HomeMarketChart";

import "../styles/home.css";

export default function Home() {

  const navigate = useNavigate();
  const { t } = useTranslation();

  /* =========================
      STATE
  ========================= */

  const [wallet, setWallet] = useState(null);

  const [rates, setRates] = useState([]);

  const [coins, setCoins] = useState([]);

  const [profit, setProfit] = useState(0);

  const [activeTab, setActiveTab] =
    useState("trending");

  const [contacts, setContacts] =
    useState([]);

  const [showContacts, setShowContacts] =
    useState(false);

  const [unreadCount, setUnreadCount] =
    useState(0);

  /* =========================
      LOAD CONTACT
  ========================= */

  async function loadContacts() {

    const { data, error } =
      await supabase
        .from("admin_contacts")
        .select("*")
        .eq("enabled", true);

    if (error) {

      console.log(error);

      return;

    }

    setContacts(data || []);

  }

  /* =========================
      LOAD NOTIFICATION
  ========================= */

  async function loadNotifications() {

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
        .eq("user_id", user.id)
        .eq("is_read", false);

    setUnreadCount(count || 0);

  }

  /* =========================
      LOAD WALLET
  ========================= */

  async function loadWallet() {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (!user) return;

    const walletData =
      await getWallet(user.id);

    setWallet(walletData);

  }

  /* =========================
      LOAD RATE
  ========================= */

  async function loadRates() {

    const rateData =
      await getExchangeRates();

    setRates(rateData || []);

  }

  /* =========================
      LOAD PROFIT
  ========================= */

  async function loadProfit() {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (!user) return;

    const { data, error } =
      await supabase
        .from("trades")
        .select("profit_amount")
        .eq("user_id", user.id)
        .eq("status", "finished");

    if (error) {

      console.log(error);

      return;

    }

    const total =
      (data || []).reduce(
        (sum, item) =>
          sum +
          Number(item.profit_amount || 0),
        0
      );

    setProfit(total);

  }
    /* =========================
      LOAD MARKET
  ========================= */

  async function loadMarket() {

    try {

      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true"
      );

      const data = await res.json();

      setCoins([
        {
          symbol: "BTC",
          name: "Bitcoin",
          logo: "/coins/btc.png",
          price: data.bitcoin.usd,
          change: data.bitcoin.usd_24h_change,
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          logo: "/coins/eth.png",
          price: data.ethereum.usd,
          change: data.ethereum.usd_24h_change,
        },
        {
          symbol: "SOL",
          name: "Solana",
          logo: "/coins/sol.png",
          price: data.solana.usd,
          change: data.solana.usd_24h_change,
        },
      ]);

    } catch (err) {

      console.log(err);

    }

  }

  /* =========================
      PAGE LOAD
  ========================= */

  useEffect(() => {

    loadContacts();
    loadMarket();
    loadNotifications();
    loadWallet();
    loadRates();
    loadProfit();

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {

          if (payload.new.user_id === user?.id) {

            loadNotifications();

          }

        }
      )
      .subscribe();

    const timer = setInterval(() => {

      loadMarket();
      loadWallet();
      loadRates();
      loadProfit();

    }, 30000);

    return () => {

      clearInterval(timer);

      supabase.removeChannel(channel);

    };

  }, []);

  /* =========================
      TOTAL ASSET
  ========================= */

  const totalAssets = useMemo(() => {

    if (!wallet || rates.length === 0) {

      return 0;

    }

    const usdtBalance =
      Number(wallet.balance || 0);

    const otherAssets = rates
      .filter(rate => rate.symbol !== "USDT")
      .reduce((sum, rate) => {

        const amount =
          Number(wallet[rate.symbol] || 0);

        return (
          sum +
          amount * Number(rate.rate || 0)
        );

      }, 0);

    return usdtBalance + otherAssets;

  }, [wallet, rates]);

  /* =========================
      RENDER
  ========================= */

  return (

    <div className="home-page">

      {/* Header */}

      <header className="home-header">

        <div className="brand-area">

          

          <h1 className="brand-title">
            TRUST
          </h1>

        </div>

        <div className="header-actions">

          <button
            className="support-btn"
            onClick={() =>
              setShowContacts(true)
            }
          >

            <Headset size={22} />

          </button>

          <button
            className="notify-btn"
            onClick={() =>
              navigate("/notifications")
            }
          >

            <Bell size={22} />

            {unreadCount > 0 && (

              <span className="notify-badge">

                {unreadCount > 99
                  ? "99+"
                  : unreadCount}

              </span>

            )}

          </button>

        </div>

      </header>

      {/* Banner */}

      <BannerSlider />

      {/* Asset */}

      <section className="asset-card">

                <div className="asset-left">

          <span className="asset-label">
            {t("assets")}
          </span>

          <h2 className="asset-balance">

            {totalAssets.toLocaleString(
              undefined,
              {
                minimumFractionDigits:2,
                maximumFractionDigits:2
              }
            )} USDT

          </h2>

        </div>

        <div className="asset-right">

          <span className="profit-label">
            {t("profit")}
          </span>

          <h3
              className={
                `profit-value ${
                  profit >= 0
                    ? "green"
                    : "red"
                }`
              }
            >

            {profit >= 0 ? "+" : ""}

            {profit.toLocaleString(
              undefined,
              {
                minimumFractionDigits:2,
                maximumFractionDigits:2
              }
            )} USDT

          </h3>

        </div>

      </section>

      {/* =======================
            ACTION GRID
      ======================= */}

      <section className="action-grid">

        <button
          className="action-box"
          onClick={() => navigate("/deposit")}
        >

          <ArrowDownToLine size={30} />

          <p>{t("deposit")}</p>

        </button>

        <button
          className="action-box"
          onClick={() => navigate("/withdraw")}
        >

          <ArrowUpFromLine size={30} />

          <p>{t("withdraw")}</p>

        </button>

        <button
          className="action-box"
          onClick={() => navigate("/transfer")}
        >

          <ArrowLeftRight size={30} />

          <p>{t("transfer")}</p>

        </button>

        <button
          className="action-box"
          onClick={() => navigate("/convert")}
        >

          <RefreshCcw size={30} />

          <p>{t("convert")}</p>

        </button>

      </section>

      {/* =======================
            MARKET WIDGET
      ======================= */}

      <section className="home-market">

        <HomeMarketChart />

      </section>

      {/* =======================
            MARKET TAB
      ======================= */}

      <section className="market-tabs">

        <button
          className={
            activeTab === "trending"
              ? "tab-btn active"
              : "tab-btn"
          }
          onClick={() =>
            setActiveTab("trending")
          }
        >
          {t("trending")}
        </button>

        <button
          className={
            activeTab === "hot"
              ? "tab-btn active"
              : "tab-btn"
          }
          onClick={() =>
            setActiveTab("hot")
          }
        >
          {t("hotMarkets")}
        </button>

      </section>

      {/* =======================
            MARKET LIST
      ======================= */}

      <section className="market-section">

        {activeTab === "trending" &&
          coins.map((coin) => (

            <div
              key={coin.symbol}
              className="market-row"
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

                  $
                  {Number(
                    coin.price
                  ).toLocaleString()}

                </div>

                <div
                  className={
                    coin.change >= 0
                      ? "market-change green"
                      : "market-change red"
                  }
                >

                  {coin.change >= 0
                    ? "▲ "
                    : "▼ "}

                  {coin.change.toFixed(2)}%

                </div>

              </div>

            </div>

          ))}

      </section>

            {/* =======================
            CONTACT MODAL
      ======================= */}

      {showContacts && (

        <div
          className="contact-overlay"
          onClick={() =>
            setShowContacts(false)
          }
        >

          <div
            className="contact-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3>

              {t("customerService")}

            </h3>

            {contacts.map((contact) => (

              <div
                key={contact.id}
                className="contact-item"
                onClick={() => {

                  const url =
                    contact.link.startsWith("http")
                      ? contact.link
                      : `https://${contact.link}`;

                  window.open(
                    url,
                    "_blank"
                  );

                }}
              >

                <img
                  src={contact.icon_url}
                  alt=""
                  className="contact-icon"
                />

                <span>

                  {contact.name}

                </span>

              </div>

            ))}

            <button
              className="close-contact"
              onClick={() =>
                setShowContacts(false)
              }
            >

              {t("close")}

            </button>

          </div>

        </div>

      )}

    </div>

  );

}