import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";

import "../styles/assets.css";

import { getWallet } from "../lib/walletApi";
import { getExchangeRates } from "../lib/convertApi";

export default function Assets() {

  const [wallet, setWallet] = useState(null);

  const [rates, setRates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showBalance, setShowBalance] = useState(true);

  const [expand, setExpand] = useState(true);

  useEffect(() => {

    loadAssets();

    window.addEventListener(
      "walletUpdated",
      loadAssets
    );

    return () => {

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

    if (!wallet) return [];

    const list = [

      {
        symbol: "BTC",
        amount: Number(wallet.BTC || 0)
      },

      {
        symbol: "ETH",
        amount: Number(wallet.ETH || 0)
      },

      {
        symbol: "BNB",
        amount: Number(wallet.BNB || 0)
      },

      {
        symbol: "TRX",
        amount: Number(wallet.TRX || 0)
      },

      {
        symbol: "ADA",
        amount: Number(wallet.ADA || 0)
      }

    ];

    return list.map(item => ({

      ...item,

      usdt:

        item.amount *

        getRate(item.symbol)

    }));

  }, [wallet, rates]);

  const totalAssets = useMemo(() => {

    return assets.reduce(

      (sum, item) =>

        sum + item.usdt,

      0

    );

  }, [assets]);

  if (loading) {

    return (

      <div className="assets-loading">

        Loading...

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

        <span>

            Total Assets

        </span>

        <button

            className="eye-btn"

            onClick={()=>
                setShowBalance(!showBalance)
            }

        >

        {

            showBalance

            ?

            <Eye size={18}/>

            :

            <EyeOff size={18}/>

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

        <div className="total-coin-name">

            USDT

        </div>

    </div>

    <div className="total-right">

        <div className="total-number">

            {
                showBalance
                ? totalAssets.toLocaleString(undefined,{
                    minimumFractionDigits:2,
                    maximumFractionDigits:2
                })
                : "******"
            }

        </div>

        <div className="total-unit">

            USDT

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

<h2>

Assets Details

</h2>

{

expand

?

<ChevronUp size={22}/>

:

<ChevronDown size={22}/>

}

</div>

{

expand &&

assets.map((coin)=>(

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