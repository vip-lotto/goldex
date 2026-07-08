import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useToast } from "../context/ToastContext";
import "./TradeReceipt.css";
import { useTranslation } from "react-i18next";
import marketData from "../data/marketData";



export default function TradePanel() {

    const TRADE_RULES = [
  {
    duration:30,
    profit:5,
    min:10,
    max:999
  },
  {
    duration:60,
    profit:10,
    min:1000,
    max:29999
  },
  {
    duration:90,
    profit:12,
    min:30000,
    max:49999
  },
  {
    duration:120,
    profit:15,
    min:50000,
    max:99999
  },
  {
    duration:180,
    profit:18,
    min:100000,
    max:999999999
  }
];

  const { showToast } = useToast();  

  const { t } = useTranslation();

  const [duration, setDuration] = useState(30);
  const [amount, setAmount] = useState("");
  const [side, setSide] = useState(null);

  const [symbol, setSymbol] = useState("XAUUSD");

  const [isTrading, setIsTrading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [tradeId, setTradeId] = useState(null);
  const [receipt, setReceipt] = useState(null);
  
  const [currentTrade, setCurrentTrade] = useState(null);


  useEffect(() => {
  console.log("Receipt =", receipt);
  }, [receipt]);


  const [walletBalance, setWalletBalance] = useState(0);
  const [tradeAmount, setTradeAmount] = useState(0);

  


 

  useEffect(() => {

  if (isTrading) return;

  if (amount >= 100000) {

    setDuration(180);

  } else if (amount >= 50000) {

    setDuration(120);

  } else if (amount >= 30000) {

    setDuration(90);

  } else if (amount >= 1000) {

    setDuration(60);

  } else {

    setDuration(30);

  }

}, [amount, isTrading]);

  useEffect(() => {

  loadTradeRules();

  resumeTrade();

}, []);

  useEffect(() => {
  if (!isTrading) return;

  if (seconds <= 0) {

    finishTrade(currentTrade);

    return;
  }

  const timer = setTimeout(() => {
    setSeconds((s) => s - 1);
  }, 1000);

  return () => clearTimeout(timer);

}, [seconds, isTrading, currentTrade]);


  // ======================================
// LOAD TRADE RULES
// ======================================

async function loadTradeRules(){

  const { data, error } = await supabase
    .from("trade_rules")
    .select("*")
    .order("duration");

  if(error){

    showToast(
      error.message,
      "error"
    );

    return;

  }

  setRules(data);

}

  async function resumeTrade() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return;

  const { data: trade } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "trading")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  if (!trade) return;

  const remain = Math.floor(
    (new Date(trade.end_at) - new Date()) / 1000
  );

  if (remain <= 0) {

  setTradeId(trade.id);
  setCurrentTrade(trade);

  await finishTrade(trade);

  return;

}

  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .single();

  setWalletBalance(wallet.balance);

  setTradeId(trade.id);
setCurrentTrade(trade);   // เพิ่มบรรทัดนี้
setSide(trade.side);
setTradeAmount(trade.amount);
setDuration(trade.duration);

  setSeconds(remain);

  setIsTrading(true);

  showToast("กลับเข้าสู่รายการเทรด", "success");
}


  async function startTrade(type) {

const currentRule = TRADE_RULES.find(
 item => Number(item.duration) === Number(duration)
);

console.log("START TRADE");

const tradeAmount = Number(amount);

if(
 !currentRule ||
 tradeAmount < Number(currentRule.min) ||
 tradeAmount > Number(currentRule.max)
){

 showToast(
 currentRule
 ? `Amount ${currentRule.min.toLocaleString()} - ${currentRule.max.toLocaleString()} USDT`
 : "กำลังโหลดกฎการเทรด",
 "warning"
 );

 return;
}



    const user = JSON.parse(
  localStorage.getItem("user")
);

if (!user) {
  showToast("กรุณาเข้าสู่ระบบ", "warning");
  return;
}

console.log("USER =", user);
console.log("TYPE =", typeof user.id);
console.log("ID =", user.id);


      

    const { data: openedTrade } = await supabase
  .from("trades")
  .select("id")
  .eq("user_id", user.id)
  .eq("status", "trading")
  .maybeSingle();

if (openedTrade) {
  showToast("คุณมีรายการเทรดที่ยังไม่เสร็จ", "warning");

  resumeTrade();

  return;
}


    // ดึง Wallet
const { data: wallet, error: walletError } = await supabase
  .from("wallets")
  .select("*")
  .eq("user_id", user.id)
  .single();

if (walletError) {

  showToast(walletError.message, "error");

  return;
}

// เงินไม่พอ
if (wallet.balance < amount) {

  showToast(
    "ยอดเงินไม่เพียงพอ",
    "warning"
  );

  return;
}

// หักเงิน
const { error: updateWalletError } = await supabase
  .from("wallets")
  .update({
    balance: wallet.balance - amount
  })
  .eq("user_id", user.id);

if (updateWalletError) {

  showToast(
    updateWalletError.message,
    "error"
  );

  return;
}

setWalletBalance(wallet.balance);
setTradeAmount(tradeAmount);

    


    const now = new Date();

const end = new Date(
  now.getTime() + duration * 1000
);

const {
  data: trade,
  error
} = await supabase
  .from("trades")
  .insert({
  user_id: user.id,
  coin: symbol,
  side: type,
  amount: tradeAmount,
  duration,
  profit: currentRule.profit,
    status: "trading",

    open_price: 0,

    started_at: now.toISOString(),
    end_at: end.toISOString(),
  })
  .select()
  .single();
        

    if (error) {

  // คืนเงินกลับ Wallet
  await supabase
    .from("wallets")
    .update({
      balance: wallet.balance
    })
    .eq("user_id", user.id);

  showToast(
    error.message,
    "error"
  );

  return;

}

    setSide(type);
setTradeId(trade.id);
setCurrentTrade(trade);
setTradeAmount(trade.amount);
setDuration(trade.duration);

setSeconds(duration);

setIsTrading(true);

showToast(
  `${type} ${amount.toLocaleString()} USDT • ${duration} Seconds`,
  "success"
);
}

// ======================================
// AUTO LOSE
// ======================================

async function autoLose(trade) {

  const { data: latest } = await supabase
    .from("trades")
    .select("status")
    .eq("id", trade.id)
    .single();

  if (!latest) return;

  if (latest.status === "finished") {
    return;
  }

  await supabase
    .from("trades")
    .update({
      status: "finished",
      result: "lose",
      payout: 0,
      profit_amount: 0,
      finished_at: new Date().toISOString(),
    })
    .eq("id", trade.id);

  setReceipt({
    id: trade.id,
    amount: trade.amount,
    duration: trade.duration,
    side: trade.side,
    result: "lose",
    payout: 0,
    time: new Date().toLocaleString(),
  });

  setCurrentTrade(null);
  setTradeId(null);
  setSeconds(0);
  setIsTrading(false);

  showToast("คุณแพ้", "error");
}

// ======================================
// FINISH TRADE
// ======================================

async function finishTrade(trade = currentTrade) {

  setIsTrading(false);

  console.log("FINISH TRADE START");

  if (!trade) return;



  const user = JSON.parse(localStorage.getItem("user"));

  // เปลี่ยนเป็น "win" เพื่อทดสอบ

 const { data: latestTrade, error: latestTradeError } = await supabase
  .from("trades")
  .select("status, result")
  .eq("id", trade.id)
  .single();

if (latestTradeError) {
  showToast(latestTradeError.message, "error");
  return;
}

if (!latestTrade) {
  return;
}

const result = latestTrade.result;

if (!result) {

  showToast(
    "กรุณารอสักครู่ ระบบกำลังประมวลผล",
    "warning"
  );

  return;

}


  let payout = 0;
  let profitAmount = 0;

  if (result === "win") {

  const { data: tradeRule, error: ruleError } = await supabase
  .from("trade_rules")
  .select("*")
  .eq("duration", trade.duration)
  .single();

if (ruleError) {
  showToast(ruleError.message, "error");
  return;
}

  profitAmount =
    (trade.amount * tradeRule.profit) / 100;

  payout =
    trade.amount + profitAmount;

    const { data: wallet, error: walletError } = await supabase
  .from("wallets")
  .select("*")
  .eq("user_id", trade.user_id)
  .single();

if (walletError) {
  showToast(walletError.message, "error");
  return;
}



await supabase
  .from("wallets")
  .update({
    balance: wallet.balance + payout,
  })
 .eq("user_id", trade.user_id);
  }

  const { error } = await supabase
  .from("trades")
  .update({

    status: "finished",

    result: result,

    payout: payout,

    profit_amount: profitAmount,

    finished_at: new Date().toISOString(),

    close_price: 0,

  })
  .eq("id", trade.id);



  if (error) {
    showToast(error.message, "error");
    return;
  }

  console.log("กำลังสร้างใบเสร็จ");

setReceipt({
  id: trade.id,
 amount: trade.amount,
duration: trade.duration,
side: trade.side,
  result,
  payout,
  time: new Date().toLocaleString(),
});

console.log("สร้างใบเสร็จแล้ว");

setCurrentTrade(null);
setTradeId(null);
setSeconds(0);


  if (result === "win") {

    showToast(
  `ชนะ +${payout.toLocaleString()} USDT`,
  "success"
);

  } else {

    showToast(
      "คุณแพ้",
      "error"
    );

  }
}

const min = String(
  Math.floor(seconds / 60)
).padStart(2, "0");

  const sec = String(
    seconds % 60
  ).padStart(2, "0");

  return (

    <div className="trade-panel">

      

    <select

value={symbol}

disabled={isTrading}

onChange={(e)=>setSymbol(e.target.value)}

>

{
marketData.map(item => (

<option

key={item.symbol}

value={item.symbol}

>

{item.name} ({item.symbol})

</option>

))

}

</select>

      <div>

        <label>{t("duration")}</label>

        <div className="trade-time-tabs">

  {[30,60,90,120,180].map(sec => (

    <button
      key={sec}
      type="button"
      disabled={isTrading}
      onClick={() => setDuration(sec)}
      className={
        duration === sec
          ? "time-btn active"
          : "time-btn"
      }
    >

      {sec === 30 ? "30 sec" : `${sec} sec`}

    </button>

  ))}

</div>

      </div>

      <div className="trade-info">

  <div>

    {
 TRADE_RULES.find(
   r => r.duration === duration
 )?.profit || 0
}%

  </div>

</div>

      <div>

        <label>{t("amount")} (USDT)</label>

        <input
  type="number"
  value={amount}
  placeholder="00.00"
  disabled={isTrading}
  onChange={(e) => setAmount(e.target.value)}
/>

      </div>

      <div className="trade-buttons">

        <button
          className="buy-btn"
          disabled={isTrading}
          onClick={() => startTrade("BUY")}
        >
          BUY
        </button>

        <button
          className="sell-btn"
          disabled={isTrading}
          onClick={() => startTrade("SELL")}
        >
          SELL
        </button>

      </div>

      {isTrading && (

        <>

          <div className="countdown">

            {min}:{sec}

          </div>

          <div className="trade-info">

            {t("status")} : {t("trading")}

            <br />

            {t("type")} : {side}

          </div>

        </>

      )}

      {receipt && (
  <div className="trade-receipt">

    <h3>{t("tradeReceipt")}</h3>

<p><strong>{t("order")} :</strong> #{receipt.id}</p>
<p><strong>{t("type")} :</strong> {receipt.side}</p>
<p><strong>{t("amount")} :</strong> {receipt.amount.toLocaleString()} USDT</p>
<p><strong>{t("duration")} :</strong> {receipt.duration} Seconds</p>
<p><strong>{t("result")} :</strong> {receipt.result.toUpperCase()}</p>
<p><strong>{t("payout")} :</strong> {receipt.payout.toLocaleString()} USDT</p>
<p><strong>{t("time")} :</strong> {receipt.time}</p>

    <button
  onClick={() => {
    setReceipt(null);
    setCurrentTrade(null);
    setTradeId(null);
    setIsTrading(false);
    setSeconds(0);
  }}
>
  {t("close")}
</button>

  </div>
)}

    </div>

  );

}