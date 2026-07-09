import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./AdminDeposit.css";


export default function AdminDeposit(){

const navigate = useNavigate();


const [deposits,setDeposits] = useState([]);

const [loading,setLoading] = useState(false);

const [processing,setProcessing] = useState(false);

const [message,setMessage] = useState("");



// ==========================
// LOAD DEPOSITS
// ==========================

useEffect(()=>{

loadDeposits();

},[]);



const loadDeposits = async()=>{


setLoading(true);


const {data,error}=

await supabase

.from("deposits")

.select(`

*

`)

.order(

"created_at",

{
ascending:false
}

);



if(error){

console.log(error);

setMessage(error.message);

setLoading(false);

return;

}



setDeposits(data || []);


setLoading(false);


};





// ==========================
// APPROVE DEPOSIT
// ==========================


const approveDeposit = async(item)=>{


if(processing)return;



if(item.status !== "pending"){

alert(
"รายการนี้ดำเนินการแล้ว"
);

return;

}



const confirm = window.confirm(

`ยืนยันเติมเงิน ${item.amount} ${item.coin}`

);



if(!confirm)return;



try{


setProcessing(true);



// LOCK ก่อน

const {data:locked,error:lockError}=

await supabase

.from("deposits")

.update({

status:"processing"

})

.eq(
"id",
item.id
)

.eq(
"status",
"pending"
)

.select();



if(lockError || !locked?.length){

throw new Error(
"รายการนี้ถูกดำเนินการแล้ว"
);

}





// ==========================
// GET PROFILE
// ==========================


const {data:profile,error:profileError}=

await supabase

.from("profiles")

.select("*")

.eq(
"id",
item.user_id
)

.single();



if(profileError || !profile){

throw new Error(
"ไม่พบ User"
);

}






// ==========================
// GET WALLET
// ==========================


const {data:wallet,error:walletError}=

await supabase

.from("wallets")

.select("*")

.eq(
"user_id",
item.user_id
)

.single();



if(walletError || !wallet){

throw new Error(
"ไม่พบ Wallet"
);

}





// ==========================
// UPDATE WALLET
// ==========================


const walletBalance =

Number(wallet.balance || 0)
+
Number(item.amount);



const {error:updateWalletError}=

await supabase

.from("wallets")

.update({

balance:walletBalance

})

.eq(
"id",
wallet.id
);



if(updateWalletError){

throw updateWalletError;

}

// ==========================
// UPDATE PROFILE BALANCE
// ==========================


const profileBalance =

Number(profile.balance || 0)
+
Number(item.amount);



const {error:updateProfileError}=

await supabase

.from("profiles")

.update({

balance:profileBalance

})

.eq(
"id",
item.user_id
);



if(updateProfileError){

throw updateProfileError;

}





// ==========================
// UPDATE USER ASSET USDT
// ==========================


const {data:asset}=

await supabase

.from("user_assets")

.select("*")

.eq(
"user_id",
item.user_id
)

.eq(
"symbol",
"USDT"
)

.single();





if(asset){



const newAssetBalance =

Number(asset.balance || 0)
+
Number(item.amount);




const {error:assetError}=

await supabase

.from("user_assets")

.update({

balance:newAssetBalance

})

.eq(
"id",
asset.id
);



if(assetError){

throw assetError;

}



}else{



await supabase

.from("user_assets")

.insert({

user_id:item.user_id,

symbol:"USDT",

balance:Number(item.amount)

});



}





// ==========================
// CLOSE DEPOSIT
// ==========================


const {error:depositError}=

await supabase

.from("deposits")

.update({

status:"approved"

})

.eq(
"id",
item.id
);



if(depositError){

throw depositError;

}





// ==========================
// TRANSACTION
// ==========================


await supabase

.from("transactions")

.insert({

user_id:item.user_id,

type:"deposit",

amount:Number(item.amount),

status:"completed",

description:

`Deposit ${item.coin} ${item.network}`

});





// ==========================
// NOTIFICATION
// ==========================


await supabase

.from("notifications")

.insert({

user_id:item.user_id,

title_key:"depositSuccess",

message_key:"depositApproved",

coin:item.coin,

network:item.network,

amount:Number(item.amount),

status:"success",

type:"deposit",

is_read:false

});






alert(
"เติมเงินสำเร็จ"
);



window.dispatchEvent(
new Event("walletUpdated")
);



loadDeposits();



}
catch(error){


console.log(error);


alert(
error.message
);


}
finally{


setProcessing(false);


}



};





// ==========================
// REJECT DEPOSIT
// ==========================


const rejectDeposit = async(item)=>{


if(item.status !== "pending"){

alert(
"รายการนี้ดำเนินการแล้ว"
);

return;

}



const ok = window.confirm(
"ยืนยันปฏิเสธรายการฝาก?"
);



if(!ok)return;



const {error}=

await supabase

.from("deposits")

.update({

status:"rejected"

})

.eq(
"id",
item.id
);



if(error){

alert(error.message);

return;

}



await supabase

.from("notifications")

.insert({

user_id:item.user_id,

title_key:"depositFailed",

message_key:"depositRejected",

coin:item.coin,

network:item.network,

amount:Number(item.amount),

status:"failed",

type:"deposit",

is_read:false

});



alert(
"ปฏิเสธสำเร็จ"
);



loadDeposits();


};

// ==========================
// UI
// ==========================


return (

<div className="admin-deposit-page">



<div className="admin-header">


<button

onClick={()=>navigate("/admin")}

>

← Back

</button>



<h1>

Deposit Management

</h1>


</div>







{
message &&

<div className="admin-message">

{message}

</div>

}








{
loading

?

<div className="loading">

Loading...

</div>


:


<table>


<thead>

<tr>


<th>
ID
</th>


<th>
User
</th>


<th>
Coin
</th>


<th>
Network
</th>


<th>
Amount
</th>


<th>
Slip
</th>


<th>
Status
</th>


<th>
Date
</th>


<th>
Action
</th>


</tr>

</thead>





<tbody>



{

deposits.map(item=>(



<tr key={item.id}>


<td>

#{item.id}

</td>





<td>

<div>

User ID:

{item.user_id}

</div>


</td>






<td>

{item.coin}

</td>





<td>

{item.network}

</td>





<td>

{

Number(item.amount)
.toLocaleString()

}

</td>





<td>


{

item.slip_url


?


<a

href={item.slip_url}

target="_blank"

rel="noreferrer"

className="slip-link"

>

View Slip

</a>


:

"-"


}



</td>






<td>


<span>


{item.status}


</span>


</td>








<td>


{

item.created_at

?

new Date(
item.created_at
)
.toLocaleString()


:

"-"


}


</td>








<td>



{

item.status === "pending"


?


<>



<button


disabled={processing}


onClick={()=>approveDeposit(item)}


className="approve-btn"

>

{

processing

?

"Processing..."

:

"Approve"

}


</button>






<button


disabled={processing}


onClick={()=>rejectDeposit(item)}


className="reject-btn"

>

Reject

</button>



</>


:


<span>

Completed

</span>


}



</td>





</tr>



))


}



</tbody>


</table>


}



</div>


);


}