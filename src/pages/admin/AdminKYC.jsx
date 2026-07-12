import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Clock,
  ShieldCheck
} from "lucide-react";

import { supabase } from "../../lib/supabase";

import "./AdminKYC.css";


export default function AdminKYC(){


const [kycs,setKycs] = useState([]);

const [loading,setLoading] = useState(true);

const [updating,setUpdating] = useState(null);



useEffect(()=>{

    loadKYC();

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


    if(error){

        console.log(error);

    }
    else{

        setKycs(data || []);

    }


    setLoading(false);

}




async function updateKYC(id,status){


    try{


        setUpdating(id);



        const {error}=await supabase

        .from("kyc")

        .update({

            status:status

        })

        .eq(
            "id",
            id
        );



        if(error)
            throw error;



        await loadKYC();



    }
    catch(err){

        console.log(err);

        alert(err.message);

    }
    finally{

        setUpdating(null);

    }

}





return (


<div className="admin-kyc-page">


<div className="kyc-header">


<div>

<h1>
<ShieldCheck size={30}/>
KYC Verification
</h1>


<p>
Review customer identity documents
</p>


</div>



<button
className="refresh-btn"
onClick={loadKYC}
>

<RefreshCw size={18}/>

Refresh

</button>


</div>




{
loading ?


<div className="loading">

Loading KYC...

</div>


:


kycs.length === 0 ?


<div className="empty">

No KYC Request

</div>


:


<div className="kyc-list">


{

kycs.map((item)=>(


<div
className="kyc-card"
key={item.id}
>



<div className="kyc-user">


<h2>

{item.first_name} {item.last_name}

</h2>


<p>

Document :
<b>
{item.document_type}
</b>

</p>



<p>

ID Number :
{item.id_number}

</p>



<p>

Country :
{item.country}

</p>




<div className={`status ${item.status}`}>

{
item.status === "pending"

?

<Clock size={16}/>

:

item.status === "approved"

?

<CheckCircle size={16}/>

:

<XCircle size={16}/>

}


{item.status}


</div>


</div>





<div className="kyc-images">



<div>

<label>
ID Card
</label>


<a
href={item.id_card_image}
target="_blank"
rel="noreferrer"
>

<img
src={item.id_card_image}
alt="ID Card"
/>


<span>

<Eye size={16}/>

View

</span>


</a>


</div>





<div>


<label>
Selfie
</label>



<a
href={item.selfie_image}
target="_blank"
rel="noreferrer"
>

<img
src={item.selfie_image}
alt="Selfie"
/>


<span>

<Eye size={16}/>

View

</span>


</a>


</div>


</div>






<div className="kyc-actions">


<button

className="approve-btn"

disabled={
updating===item.id
}

onClick={()=>
updateKYC(
item.id,
"approved"
)}

>

<CheckCircle size={18}/>

Approve

</button>





<button

className="reject-btn"

disabled={
updating===item.id
}

onClick={()=>
updateKYC(
item.id,
"rejected"
)}

>

<XCircle size={18}/>

Reject

</button>


</div>



</div>


))


}


</div>


}


</div>


);


}