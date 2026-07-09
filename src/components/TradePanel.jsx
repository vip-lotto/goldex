import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
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





useEffect(()=>{

loadUser();

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






function getProfit(){


const money =
Number(amount);



if(money>=100000)
return 18;


if(money>=50000)
return 15;


if(money>=30000)
return 12;


if(money>=1000)
return 10;


return 5;


}







async function getFinalResult(){


let result="lose";



const {
data
}=await supabase

.from("trade_control")

.select("*")

.eq(
"id",
1
)

.single();




if(data){


if(
!data.global_until ||
new Date(data.global_until)>new Date()
){

result=data.global_result;

}


}



return result;


}


// =========================
// START TRADE
// =========================


async function startTrade(type){


if(isTrading){

return;

}



if(!user){

showToast("Please login");

return;

}



const money = Number(amount);



if(!money || money<=0){

showToast("Enter amount");

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

duration:duration,

profit:getProfit(),


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

setSeconds(duration);



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
await getFinalResult();





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








setReceipt({

...trade,

result:finalResult,

payout:payout,

profit:profit

});





setIsTrading(false);

setSeconds(0);

setActiveTrade(null);



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


{

[30,60,90,120,180]

.map(t=>(


<button

key={t}

disabled={isTrading}

className={

duration===t

?

"time-btn active"

:

"time-btn"

}

onClick={()=>setDuration(t)}

>

{t}s

</button>


))


}


</div>








<input

type="number"

value={amount}

disabled={isTrading}

placeholder="Amount USDT"

onChange={e=>

setAmount(e.target.value)

}

/>








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

isTrading &&

<div className="countdown-box">


<h3>

Trading

</h3>


<h1>

{min}:{sec}

</h1>


<p>

{activeTrade?.coin}

</p>


<p>

{side}

</p>


</div>


}









{

receipt &&


<div className="trade-receipt">


<h3>

Transaction Details

</h3>


<p>

Order #{receipt.id}

</p>


<p>

Market : {receipt.coin}

</p>


<p>

Result :

{receipt.result}

</p>


<p>

Payout :

{Number(receipt.payout||0).toLocaleString()}

USDT

</p>



<button

onClick={()=>setReceipt(null)}

>

Close

</button>


</div>


}




</div>

);


}