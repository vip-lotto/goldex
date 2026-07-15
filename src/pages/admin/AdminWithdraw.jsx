import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./AdminWithdraw.css";


export default function AdminWithdraw(){

const navigate = useNavigate();


const [withdraws,setWithdraws] = useState([]);

const [loading,setLoading] = useState(false);



// =====================
// LOAD
// =====================

useEffect(()=>{

loadWithdraws();

},[]);



const loadWithdraws = async () => {

  const { data: withdrawData, error } = await supabase
    .from("withdrawals")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.log(error);
    return;
  }

  setWithdraws(withdrawData || []);

};





// =====================
// APPROVE
// =====================


const approveWithdraw = async(item)=>{


if(item.status !== "pending"){

alert("รายการนี้ถูกทำแล้ว");

return;

}



setLoading(true);

// เช็คสถานะล่าสุดอีกรอบ
const {data:checkWithdraw}=await supabase
.from("withdrawals")
.select("status")
.eq("id",item.id)
.single();


if(!checkWithdraw || checkWithdraw.status !== "pending"){

alert("รายการนี้ถูกทำแล้ว");

setLoading(false);

return;

}

// wallet

const { data: wallet, error: walletError } =
await supabase
  .from("wallets")
  .select("*")
  .eq("user_id", item.user_id)
  .single();



if(walletError || !wallet){

alert("ไม่พบ Wallet");

setLoading(false);

return;

}

let oldBalance = 0;

console.log(
  "Withdraw Check:",
  item.coin,
  "Amount:",
  item.amount,
  "Wallet:",
  wallet
);

switch (item.coin) {

  case "USDT":
    oldBalance = Number(wallet.balance || 0);
    break;

  case "BTC":
    oldBalance = Number(wallet.BTC || 0);
    break;

  case "ETH":
    oldBalance = Number(wallet.ETH || 0);
    break;

  case "BNB":
    oldBalance = Number(wallet.BNB || 0);
    break;

  case "TRX":
    oldBalance = Number(wallet.TRX || 0);
    break;

  case "ADA":
    oldBalance = Number(wallet.ADA || 0);
    break;

  default:
    oldBalance = 0;
}

const withdrawAmount =
Number(item.amount);

if(oldBalance < withdrawAmount){

alert("ยอดเงินไม่พอ");

setLoading(false);

return;

}




const newBalance =
oldBalance - withdrawAmount;





// update wallet

let updateData = {};

switch (item.coin) {

  case "USDT":
    updateData.balance = newBalance;
    break;

  case "BTC":
    updateData.BTC = newBalance;
    break;

  case "ETH":
    updateData.ETH = newBalance;
    break;

  case "BNB":
    updateData.BNB = newBalance;
    break;

  case "TRX":
    updateData.TRX = newBalance;
    break;

  case "ADA":
    updateData.ADA = newBalance;
    break;

  default:
    alert("ไม่รองรับเหรียญนี้");
    setLoading(false);
    return;
}

const { error: updateError } = await supabase
  .from("wallets")
  .update(updateData)
  .eq("user_id", item.user_id);

console.log(
"Wallet updated:",
updateData
);


if(updateError){

alert(updateError.message);

setLoading(false);

return;

}





// update withdrawal


const {error:withdrawError}=await supabase
.from("withdrawals")
.update({

status:"approved",

admin_message:"Approved"

})
.eq("id",item.id);



if(withdrawError){

alert(withdrawError.message);

setLoading(false);

return;

}









// transaction


await supabase

.from("transactions")

.insert({

user_id:item.user_id,

type:"withdraw",

amount:
withdrawAmount,

status:"completed",

description:
`Withdraw ${item.coin}`

});







// notification


await supabase

.from("notifications")

.insert({

user_id:item.user_id,

title_key:
"withdrawSuccess",

message_key:
"withdrawApproved",

amount:
withdrawAmount,

coin:
item.coin,

network:
item.network,

type:"withdraw",

status:"success",

is_read:false

});




alert("Approve สำเร็จ");


setLoading(false);


loadWithdraws();


};







// =====================
// REJECT
// =====================


const rejectWithdraw = async(item)=>{


if(item.status !== "pending"){

alert("รายการนี้ถูกทำแล้ว");

return;

}



await supabase
.from("withdrawals")
.update({

status: "rejected",

admin_message: "Rejected"

})
.eq("id", item.id);




await supabase

.from("notifications")

.insert({

user_id:item.user_id,

title_key:
"withdrawFailed",

message_key:
"withdrawRejected",

amount:
Number(item.amount),

coin:
item.coin,

network:
item.network,

type:"withdraw",

status:"failed",

is_read:false

});




alert("Reject สำเร็จ");


loadWithdraws();


};








return (

<div
style={{
minHeight:"100vh",
background:"#06152d",
color:"#fff",
padding:"30px"
}}
>



<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:30
}}
>


<button

onClick={()=>navigate("/admin")}

style={{

background:"#facc15",

border:0,

padding:"10px 20px",

borderRadius:10,

cursor:"pointer",

fontWeight:"bold"

}}

>

← Back

</button>



<h1
style={{
color:"#facc15"
}}
>
Withdraw Management
</h1>



<div/>

</div>






<table
style={{
width:"100%",
borderCollapse:"collapse",
background:"#111d32"
}}
>


<thead>

<tr
style={{
background:"#162544"
}}
>


<th>ID</th>

<th>UID</th>

<th>Name</th>

<th>Coin</th>

<th>Network</th>

<th>Amount</th>

<th>Address</th>

<th>QR</th>

<th>Status</th>

<th>Date</th>

<th>Action</th>


</tr>


</thead>





<tbody>


{

withdraws.map(item=>(


<tr
key={item.id}
style={{
borderBottom:"1px solid #334155"
}}
>


<td>
#{item.id}
</td>


<td>

{item.member_id || "-"}

</td>

<td>

{item.first_name} {item.last_name}

</td>


<td>
{item.coin}
</td>


<td>
{item.network}
</td>


<td>
{item.amount}
</td>

{/* Address */}
<td
style={{
maxWidth:220,
wordBreak:"break-all"
}}
>

<div>
{item.address || "-"}
</div>

{
item.address && (

<button
style={{
marginTop:5,
padding:"4px 10px",
cursor:"pointer"
}}
onClick={()=>{
navigator.clipboard.writeText(item.address);
alert("Copy Address แล้ว");
}}
>

Copy

</button>

)

}

</td>

{/* QR */}
<td>

{
item.qr_image

?

<img
src={item.qr_image}
alt="QR"
style={{
width:70,
height:70,
borderRadius:8,
cursor:"pointer",
objectFit:"cover"
}}
onClick={()=>
window.open(item.qr_image,"_blank")
}
/>

:

"-"

}

</td>

{/* Status */}
<td>

{item.status}

</td>

{/* Date */}
<td>

{
new Date(item.created_at)
.toLocaleString()
}

</td>




<td>


{

item.status==="pending"

?


<>


<button

disabled={loading}

onClick={()=>
approveWithdraw(item)
}

style={{
background:"#16a34a",
color:"#fff",
border:0,
padding:"8px 15px",
borderRadius:8,
marginRight:10
}}

>

Approve

</button>





<button

disabled={loading}

onClick={()=>
rejectWithdraw(item)
}

style={{
background:"#dc2626",
color:"#fff",
border:0,
padding:"8px 15px",
borderRadius:8
}}

>

Reject

</button>


</>


:

<span>

Done

</span>


}



</td>



</tr>


))


}



</tbody>



</table>



</div>


);


}