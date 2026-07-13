import { useEffect, useState } from "react";
import {
  Check,
  X,
  ArrowLeft,
  RefreshCw
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

import "./AdminKYC.css";


export default function AdminKYC(){

const navigate = useNavigate();

const [kycs,setKycs]=useState([]);

const [loading,setLoading]=useState(true);

const [updating,setUpdating]=useState(null);



useEffect(()=>{

loadKYC();


const channel=supabase
.channel("admin-kyc")
.on(
"postgres_changes",
{
event:"*",
schema:"public",
table:"kyc"
},
()=>{
loadKYC();
}
)
.subscribe();


return()=>{

supabase.removeChannel(channel);

};


},[]);



async function loadKYC(){

setLoading(true);


const {data,error}=await supabase

.from("kyc")

.select("*")

.order(
"created_at",
{
ascending:false
}
);


if(!error){

setKycs(data || []);

}


setLoading(false);

}




async function updateKYC(id,status){


const ok=window.confirm(
status==="approved"
?
"Approve KYC?"
:
"Reject KYC?"
);


if(!ok)return;


setUpdating(id);



const {error}=await supabase

.from("kyc")

.update({
status
})

.eq(
"id",
id
);



if(!error){

setKycs(prev=>

prev.map(item=>

item.id===id

?
{
...item,
status
}

:

item

)

);


}



setUpdating(null);


}




return(

<div className="admin-kyc-page">


<div className="kyc-topbar">


<button
className="back-btn"
onClick={()=>navigate(-1)}
>

<ArrowLeft size={18}/>

Back

</button>



<h1>
KYC Verification
</h1>



<button
className="refresh-btn"
onClick={loadKYC}
>

<RefreshCw size={18}/>

Refresh

</button>



</div>



<div className="kyc-table-box">


<table>


<thead>

<tr>

<th>ID</th>

<th>User</th>

<th>Document</th>

<th>ID Number</th>

<th>Country</th>

<th>ID Card</th>

<th>Selfie</th>

<th>Status</th>

<th>Date</th>

<th>Action</th>


</tr>

</thead>



<tbody>


{

loading ?

<tr>

<td colSpan="10">

Loading...

</td>

</tr>


:


kycs.map(item=>(


<tr key={item.id}>


<td>
#{item.id}
</td>



<td>

User ID:{item.user_id}

<br/>

{item.first_name} {item.last_name}

</td>



<td>

{item.document_type}

</td>



<td>

{item.id_number}

</td>



<td>

{item.country}

</td>



<td>

<a
href={item.id_card_image}
target="_blank"
>

View ID

</a>

</td>



<td>

<a
href={item.selfie_image}
target="_blank"
>

View Selfie

</a>

</td>




<td>


<span
className={
`kyc-status ${item.status}`
}
>

{item.status}

</span>


</td>



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


<div className="action">


<button

className="approve"

disabled={updating===item.id}

onClick={()=>
updateKYC(
item.id,
"approved"
)
}

>

<Check size={16}/>

Approve

</button>



<button

className="reject"

disabled={updating===item.id}

onClick={()=>
updateKYC(
item.id,
"rejected"
)
}

>

<X size={16}/>

Reject

</button>


</div>


:

<span className="done">

Completed

</span>


}



</td>



</tr>


))

}


</tbody>


</table>


</div>


</div>

)

}