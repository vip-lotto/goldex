import { useEffect, useMemo, useState } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import "./homeMarketChart.css";
import { useTranslation } from "react-i18next";

const MARKETS = [
  { title: "BTC", symbol: "BINANCE:BTCUSDT" },
  { title: "ETH", symbol: "BINANCE:ETHUSDT" },
  { title: "BNB", symbol: "BINANCE:BNBUSDT" },
  { title: "SOL", symbol: "BINANCE:SOLUSDT" },
  { title: "XRP", symbol: "BINANCE:XRPUSDT" },
  { title: "AVAX", symbol: "BINANCE:AVAXUSDT" },
  { title: "LINK", symbol: "BINANCE:LINKUSDT" },
  { title: "TON", symbol: "BINANCE:TONUSDT" },
];

const PERIODS = ["1", "5", "15", "60", "240", "1D"];

const DEFAULT_CARDS = [
  {
    title: "BTC",
    symbol: "BINANCE:BTCUSDT",
    logo: "/coins/btc.png",
    leverage: "40x",
  },
  {
    title: "ETH",
    symbol: "BINANCE:ETHUSDT",
    logo: "/coins/eth.png",
    leverage: "25x",
  },
  {
    title: "BNB",
    symbol: "BINANCE:BNBUSDT",
    logo: "/coins/bnb.png",
    leverage: "20x",
  },
  {
    title: "SOL",
    symbol: "BINANCE:SOLUSDT",
    logo: "/coins/sol.png",
    leverage: "20x",
  },
  {
    title: "XRP",
    symbol: "BINANCE:XRPUSDT",
    logo: "/coins/xrp.png",
    leverage: "20x",
  },
  {
    title: "AVAX",
    symbol: "BINANCE:AVAXUSDT",
    logo: "/coins/avax.png",
    leverage: "20x",
  },
  {
    title: "LINK",
    symbol: "BINANCE:LINKUSDT",
    logo: "/coins/link.png",
    leverage: "20x",
  },
  {
    title: "TON",
    symbol: "BINANCE:TONUSDT",
    logo: "/coins/ton.png",
    leverage: "20x",
  },
];

export default function HomeMarketChart() {

  const { t } = useTranslation();

  const [market, setMarket] = useState(MARKETS[0]);

  const [interval, setInterval] = useState("60");

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketInfo, setMarketInfo] = useState({
  price: "--",
  change: "--",
});

  useEffect(() => {

    loadCrypto();

    const timer = setInterval(() => {

        loadCrypto();

    }, 5000);

    return () => clearInterval(timer);

}, []);

  async function loadCrypto() {
    try {
      const res = await fetch(
        "https://api.binance.com/api/v3/ticker/24hr"
      );

      const data = await res.json();

      const result = DEFAULT_CARDS.map((coin) => {
        const symbol = coin.symbol.replace("BINANCE:", "");

        const api = data.find((x) => x.symbol === symbol);

        if (!api) {
          return {
            ...coin,
            price: "--",
            percent: "--",
            color: "green",
          };
        }

        const percent = Number(api.priceChangePercent);

        return {
          ...coin,
          price: Number(api.lastPrice).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          percent: percent.toFixed(2) + "%",
          color: percent >= 0 ? "green" : "red",
        };
      });

      setCards(result);

      const current = result.find(
  (item) => item.symbol === selectedMarket.symbol
);

if (current) {
  setMarketInfo({
    price: current.price,
    change: current.percent,
  });
}

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const selectedMarket = useMemo(() => market, [market]);

  return (
    <div className="market-widget">

      <div className="perpetual-header">

        <div>

          <h2>{t("perpetuals")}</h2>

          <p className="perpetual-subtitle">
            🟢 {t("liveCryptoMarket")}
          </p>

        </div>

        

      </div>

      <div className="perpetual-list">

        {loading && (
          <div className="loading-card">

    <div className="loader"></div>

    {t("loadingMarket")}

</div>
        )}

        {!loading &&
          cards.map((item) => (

            <div
              key={item.symbol}
              className="coin-card"
              onClick={() =>
                setMarket({
                  title: item.title,
                  symbol: item.symbol,
                })
              }
            >

              <img
    src={item.logo}
    alt={item.title}
    className="coin-logo"
/>

<h3 className="coin-title">
    {item.title}
</h3>

<div className="coin-price">
    ${item.price}
</div>

<div
    className={
        item.color === "green"
            ? "coin-percent green"
            : "coin-percent red"
    }
>
    {item.color === "green" ? "▲ " : "▼ "}
    {item.percent}
</div>

<div className="coin-info">
    <span>{item.leverage}</span>
    <span>USDT</span>
</div>

            </div>

          ))}

      </div>

            {/* =========================
          Market Header
      ========================= */}

      

      {/* =========================
          Market Tabs
      ========================= */}

      

      {/* =========================
          Timeframe
      ========================= */}

      

      {/* =========================
          Chart Container
      ========================= */}

      

      {/* =========================
          Market Summary
      ========================= */}

      <div className="market-summary">

        <div className="summary-card">

  <span className="summary-title">

    {t("currentMarket")}

  </span>

  <h3>

    {selectedMarket.title} Spot

  </h3>

  <h2>

    ${marketInfo.price}

  </h2>

  <p
    className={
      Number(marketInfo.change) >= 0
        ? "green"
        : "red"
    }
  >

    {Number(marketInfo.change) >= 0
      ? "▲ "
      : "▼ "}

    {marketInfo.change}

  </p>

</div>

        <div className="summary-card">

  <span className="summary-title">

    {t("interval")}

  </span>

  <h3>

    {interval === "1" && "1 Minute"}

    {interval === "5" && "5 Minutes"}

    {interval === "15" && "15 Minutes"}

    {interval === "60" && "1 Hour"}

    {interval === "240" && "4 Hours"}

    {interval === "1D" && "1 Day"}

  </h3>

  <p>

    {t("updated")}

    {" "}

    {new Date().toLocaleTimeString()}

  </p>

</div>

        <div className="summary-card">

          <span className="summary-title">
            {t("markets")}
          </span>

          <h3>
            99+
          </h3>

          <p>
            {t("available")}
          </p>

        </div>

      

      </div>
            {/* =========================
          Footer
      ========================= */}

      <div className="market-footer">

        <div className="footer-left">
          {t("marketDescription1")}
        </div>

        <div className="footer-right">
          {t("marketDescription2")}
        </div>

      </div>

    </div>
  );
}