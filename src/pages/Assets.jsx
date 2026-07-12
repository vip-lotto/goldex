import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";

import "../styles/assets.css";

import { useTranslation } from "react-i18next";

import { getWallet } from "../lib/walletApi";
import { getExchangeRates } from "../lib/convertApi";

export default function Assets() {

  const { t } = useTranslation();

  const [wallet, setWallet] = useState(null);

  const [rates, setRates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showBalance, setShowBalance] = useState(true);

  const [expand, setExpand] = useState(false);

  useEffect(() => {

  loadAssets();

  // รีโหลดทุก 10 วินาที
  const interval = setInterval(() => {
    loadAssets();
  }, 10000);

  window.addEventListener(
    "walletUpdated",
    loadAssets
  );

  return () => {

    clearInterval(interval);

    window.removeEventListener(
      "walletUpdated",
      loadAssets
    );

  };

}, []);

  async function loadAssets() {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) return;

    try {

      const walletData =
        await getWallet(user.id);

      const rateData =
        await getExchangeRates();

      setWallet(walletData);

      setRates(rateData || []);

    }

    finally {

      setLoading(false);

    }

  }

  function getRate(symbol) {

    const rate = rates.find(
      item => item.symbol === symbol
    );

    return Number(rate?.rate || 0);

  }

  const assets = useMemo(() => {

  if (!wallet || rates.length === 0) return [];

  return rates
    .filter(rate => rate.symbol !== "USDT")
    .map(rate => {

      const amount = Number(wallet[rate.symbol] || 0);

      return {
        symbol: rate.symbol,
        amount,
        usdt: amount * Number(rate.rate || 0)
      };

    });

}, [wallet, rates]);

 const totalAssets = useMemo(() => {

  const usdtBalance = Number(wallet?.balance || 0);

  const otherAssets = assets.reduce(
    (sum, item) => sum + Number(item.usdt || 0),
    0
  );

  return usdtBalance + otherAssets;

}, [wallet, assets]);

const popularCoins = ["BTC", "ETH", "BNB", "TRX", "ADA"];

const displayAssets = expand
  ? assets
  : popularCoins
      .map(symbol => assets.find(item => item.symbol === symbol))
      .filter(Boolean);

  if (loading) {

    return (

      <div className="assets-loading">

        {t("loading")}

      </div>

    );

  }

    return (

<div className="assets-page">

{/* =====================================
            Total Assets
===================================== */}

<div className="assets-total-card">

    <div className="assets-total-top">


  <div className="assets-title">

    <span>{t("totalAssets")}</span>

  </div>



  <button
    className="eye-btn"
    onClick={() => setShowBalance(!showBalance)}
  >

    {showBalance 
      ? <Eye size={20} /> 
      : <EyeOff size={20} />
    }

  </button>


</div>

    <div className="assets-total-value">

    <div className="total-left">

    <img
        src="/coins/usdt.png"
        alt="USDT"
        className="total-usdt-logo"
    />

</div>

    <div className="total-right">

  <div className="total-main">

    <div className="total-number">
      {showBalance
        ? totalAssets.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        : "******"}
    </div>

    <div className="total-unit">
      USDT
    </div>

  </div>

  <div className="total-sub">
    {showBalance
      ? `≈ ${totalAssets.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })} USDT`
      : "******"}
  </div>

</div>

</div>

</div>

{/* =====================================
          Assets Details
===================================== */}

<div className="assets-card">

<div

className="assets-header"

onClick={()=>

setExpand(!expand)

}

>

<h2>{t("assetsDetails")}</h2>

{

expand

?

<ChevronUp size={22}/>

:

<ChevronDown size={22}/>

}

</div>

{

displayAssets.map((coin) => (

<div

key={coin.symbol}

className="asset-row"

>

<div className="asset-left">

<img

src={`/coins/${coin.symbol.toLowerCase()}.png`}

alt={coin.symbol}

className="asset-icon"

/>

<div>

<div className="asset-symbol">

{coin.symbol}

</div>

</div>

</div>

<div className="asset-right">

<div className="asset-amount">

{

showBalance

?

coin.amount.toFixed(6)

:

"******"

}

</div>

<div className="asset-usdt">

≈

{

showBalance

?

coin.usdt.toLocaleString(

undefined,

{

minimumFractionDigits:2,

maximumFractionDigits:2

}

)

:

"******"

}

USDT

</div>

</div>

</div>

))

}

</div>

</div>

);

}