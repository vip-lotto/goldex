import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";
import { useToast } from "../context/ToastContext";

import CoinSelect from "../components/CoinSelect";

import "../styles/Convert.css";

export default function Convert() {

  const navigate = useNavigate();

  const { showToast } = useToast();

  /* ===========================
     STATE
  =========================== */

  const [pageLoading, setPageLoading] =
    useState(true);

  const [converting, setConverting] =
    useState(false);

  const [coins, setCoins] =
    useState([]);

  const [assets, setAssets] =
    useState([]);

  const [fromCoin, setFromCoin] =
    useState(null);

  const [toCoin, setToCoin] =
    useState(null);

  const [amount, setAmount] =
    useState("");

  const [receiveAmount, setReceiveAmount] =
    useState(0);

  /* ===========================
     LOAD DATA
  =========================== */

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    try {

      setPageLoading(true);

      const user =
  JSON.parse(
    localStorage.getItem("user")
  );

console.log("USER =", user);

if (!user) {

  showToast(
    "ไม่พบข้อมูลผู้ใช้",
    "error"
  );

  return;
}

      /* -------------------------
         โหลดรายการเหรียญ
      ------------------------- */

      const {
  data: coinData,
  error: coinError,
  status
} = await supabase
  .from("exchange_rates")
  .select("*");

console.log("STATUS =", status);
console.log("coinError =", coinError);
console.log("coinData =", coinData);

      

    if (coinError) {
    throw coinError;
    }
      /* -------------------------
         โหลดกระเป๋าผู้ใช้
      ------------------------- */

      const {
  data: assetData,
  error: assetError,
  status: assetStatus
} = await supabase
  .from("wallets")
.select("*")
.eq("user_id", user.id)
.single();

console.log("ASSET STATUS =", assetStatus);
console.log("assetError =", assetError);
console.log("assetData =", assetData);

if (assetError) {
  throw assetError;
}

      console.log("assetError =", assetError);
      console.log("assetData =", assetData);

      setCoins(
        coinData || []
      );

      console.log("COINS =", coinData);


      setAssets(assetData);

      console.log("ASSETS =", assetData);


      /* -------------------------
         ค่าเริ่มต้น
      ------------------------- */

      const usdt =
        coinData.find(
          item =>
            item.symbol === "USDT"
        );

      const btc =
        coinData.find(
          item =>
            item.symbol === "BTC"
        );

      if (usdt)
        setFromCoin(usdt);

      if (btc)
        setToCoin(btc);

    } catch (err) {

      console.log(err);

      showToast(
        err.message,
        "error"
      );

    } finally {

      setPageLoading(false);

    }

  }

    /* ===========================
     GET BALANCE
  =========================== */

  function getBalance(symbol) {

  if (!assets) return 0;

  switch(symbol){

    case "USDT":
      return Number(assets.balance || 0);

    case "BTC":
      return Number(assets.BTC || 0);

    case "ETH":
      return Number(assets.ETH || 0);

    case "BNB":
      return Number(assets.BNB || 0);

    case "ADA":
      return Number(assets.ADA || 0);

    case "TRX":
      return Number(assets.TRX || 0);

    default:
      return 0;

  }

}

  /* ===========================
     TO LIST
  =========================== */

  const toCoins =
    coins.filter(item => {

      if (!fromCoin)
        return true;

      return (
        item.symbol !==
        fromCoin.symbol
      );

    });

  /* ===========================
     CALCULATE
  =========================== */

  useEffect(() => {

    if (
      !fromCoin ||
      !toCoin
    ) {

      setReceiveAmount(0);

      return;

    }

    const input =
      Number(amount);

    if (!input) {

      setReceiveAmount(0);

      return;

    }

    /*
      ทุกเหรียญอ้างอิง
      ราคา USDT
    */

    const usdtValue =

      input *

      Number(
        fromCoin.rate
      );

    const receive =

      usdtValue /

      Number(
        toCoin.rate
      );

    setReceiveAmount(
      receive
    );

  }, [
    amount,
    fromCoin,
    toCoin
  ]);

  /* ===========================
     CHANGE FROM
  =========================== */

  function changeFrom(symbol) {

    const coin =
      coins.find(
        item =>
          item.symbol === symbol
      );

    if (!coin)
      return;

    setFromCoin(coin);

    if (
      toCoin &&
      toCoin.symbol === symbol
    ) {

      const nextCoin =
        coins.find(
          item =>
            item.symbol !== symbol
        );

      if (nextCoin) {

        setToCoin(
          nextCoin
        );

      }

    }

  }

  /* ===========================
     CHANGE TO
  =========================== */

  function changeTo(symbol) {

    const coin =
      coins.find(
        item =>
          item.symbol === symbol
      );

    if (!coin)
      return;

    setToCoin(
      coin
    );

  }

  /* ===========================
     SWAP
  =========================== */

  function swapCoin() {

    if (
      !fromCoin ||
      !toCoin
    ) return;

    const oldFrom =
      fromCoin;

    setFromCoin(
      toCoin
    );

    setToCoin(
      oldFrom
    );

  }

    /* ===========================
     CONVERT
  =========================== */

  async function handleConvert() {

    try {

      setConverting(true);

      if (!fromCoin || !toCoin) {

        showToast(
          "กรุณาเลือกเหรียญ",
          "warning"
        );

        return;

      }

      const input =
        Number(amount);

      if (!input || input <= 0) {

        showToast(
          "กรุณากรอกจำนวนเงิน",
          "warning"
        );

        return;

      }

      const balance =
        getBalance(
          fromCoin.symbol
        );

      if (input > balance) {

        showToast(
          "ยอดเงินไม่เพียงพอ",
          "error"
        );

        return;

      }

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

 const updateData = {};

// หักเงินต้นทาง
if (fromCoin.symbol === "USDT") {

  updateData.balance =
    Number(assets.balance) - input;

} else {

  updateData[fromCoin.symbol] =
    Number(assets[fromCoin.symbol]) - input;

}

// เพิ่มเงินปลายทาง
if (toCoin.symbol === "USDT") {

  updateData.balance =
    Number(
      updateData.balance ?? assets.balance
    ) + Number(receiveAmount);

} else {

  updateData[toCoin.symbol] =
    Number(
      updateData[toCoin.symbol] ??
      assets[toCoin.symbol]
    ) + Number(receiveAmount);

}

const { error:error1 } =
await supabase
  .from("wallets")
  .update(updateData)
  .eq("user_id", user.id);

if(error1)
  throw error1;

      /* ======================
         HISTORY
      ====================== */

      const {
        error:error3
      } = await supabase

.from("convert_history")

.insert({

  user_id: user.id,

  from_symbol: fromCoin.symbol,

  to_symbol: toCoin.symbol,

  from_amount: input,

  to_amount: receiveAmount,

  rate: toCoin.rate

});

      if(error3)
        throw error3;

      

      setAmount("");

      setReceiveAmount(0);

      await loadData();

        window.dispatchEvent(
        new Event("walletUpdated")
        );

        showToast(
        "Convert Success",
        "success"
        );

    } catch(err) {

      console.log(err);

      showToast(
        err.message,
        "error"
      );

    } finally {

      setConverting(false);

    }

  }

    /* ===========================
     LOADING
  =========================== */

  if (pageLoading) {

    return (

      <div className="convert-page">

        <h2>Loading...</h2>

      </div>

    );

  }

  return (

    <div className="convert-page">

      {/* ================= HEADER ================= */}

      <div className="convert-header">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={22}/>
        </button>

        <h2>Convert</h2>

      </div>

      {/* ================= FROM ================= */}

      <div className="convert-card">

        <h3>From</h3>

        <CoinSelect
    coins={coins}
    value={fromCoin}
    onChange={changeFrom}
/>

        <p className="balance-text">

          Balance :

          {" "}

          {getBalance(fromCoin?.symbol).toLocaleString()}

          {" "}

          {fromCoin?.symbol}

        </p>

      </div>

      {/* ================= AMOUNT ================= */}

      <div className="convert-card">

        <h3>Amount</h3>

        <input

          className="amount-input"

          type="number"

          placeholder="0.00"

          value={amount}

          onChange={(e)=>

            setAmount(
              e.target.value
            )

          }

        />

      </div>

      {/* ================= SWAP ================= */}

      <div
        className="swap-circle"
        onClick={swapCoin}
      >

        <ArrowUpDown size={26}/>

      </div>

      {/* ================= TO ================= */}

      <div className="convert-card">

        <h3>To</h3>

        <CoinSelect
    coins={toCoins}
    value={toCoin}
    onChange={changeTo}
/>

        <p className="balance-text">

          Balance :

          {" "}

          {getBalance(toCoin?.symbol).toLocaleString()}

          {" "}

          {toCoin?.symbol}

        </p>

      </div>

      {/* ================= RATE ================= */}

      <div className="convert-card">

        <h3>Rate</h3>

        <p>

            {

            fromCoin && toCoin

            ?

            `1 ${fromCoin.symbol} = ${

            (
            Number(fromCoin.rate)

            /

            Number(toCoin.rate)

            ).toFixed(8)

            } ${toCoin.symbol}`

            :

            "-"

            }

            </p>

      </div>

      {/* ================= RECEIVE ================= */}

      <div className="convert-card">

        <h3>Receive</h3>

        <div className="receive-box">

          {receiveAmount.toFixed(8)}

          {" "}

          {toCoin?.symbol}

        </div>

      </div>

      {/* ================= BUTTON ================= */}

      <button

        className="convert-btn"

        onClick={handleConvert}

        disabled={converting}

      >

        {

          converting

          ?

          "Converting..."

          :

          "Convert Now"

        }

      </button>

    </div>

  );

}