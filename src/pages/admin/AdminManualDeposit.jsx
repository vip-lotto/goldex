import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import {Search,Plus,Minus} from "lucide-react";
import {supabase} from "../../lib/supabase";


export default function AdminManualDeposit(){

const navigate = useNavigate();


const [search,setSearch]=useState("");

const [users,setUsers]=useState([]);

const [selected,setSelected]=useState(null);

const [wallet,setWallet]=useState(null);

const [amount,setAmount]=useState("");

const [msg,setMsg]=useState("");



// =========================
// LOAD LAST USERS
// =========================

useEffect(()=>{

loadUsers();

},[]);



const loadUsers=async()=>{


const {data,error}=await supabase

.from("profiles")

.select(`
id,
member_id,
first_name,
last_name,
phone,
email,
created_at
`)

.order(
"created_at",
{
ascending:false
}
)

.limit(10);



if(error){

console.log(error);

return;

}


setUsers(data || []);

};




// =========================
// SEARCH
// =========================


const result = users.filter((u)=>{


const s=search.toLowerCase();


return (

String(u.member_id)
.includes(s)

||

String(u.phone || "")
.includes(s)

||

(u.email || "")
.toLowerCase()
.includes(s)

||

(u.first_name || "")
.toLowerCase()
.includes(s)

||

(u.last_name || "")
.toLowerCase()
.includes(s)

);


});




// =========================
// OPEN USER
// =========================


const openUser=async(user)=>{


setSelected(user);


const {data,error}=await supabase

.from("wallets")

.select("*")

.eq(
"user_id",
user.id
)

.single();



if(error){

console.log(error);

setWallet(null);

return;

}


setWallet(data);


};




// =========================
// ADD REMOVE MONEY
// =========================


const changeMoney=async(type)=>{


if(!wallet){

setMsg("Wallet not found");

return;

}



const value=Number(amount);



if(!value || value<=0){

setMsg("Enter amount");

return;

}



let balance =
Number(wallet.balance || 0);



if(type==="add"){

balance += value;

}



if(type==="remove"){

balance -= value;

}




if(balance < 0){

setMsg("Balance not enough");

return;

}




const {error}=await supabase

.from("wallets")

.update({

balance:balance

})

.eq(
"id",
wallet.id
);



if(error){

console.log(error);

setMsg(error.message);

return;

}




setWallet({

...wallet,

balance:balance

});



setAmount("");



setMsg(

type==="add"

?

"Add money success"

:

"Remove money success"

);


};

// =========================
// STYLE
// =========================

const th={

padding:"15px",

textAlign:"left",

fontSize:15

};


const td={

padding:"15px",

borderBottom:"1px solid #243451"

};




// =========================
// RETURN UI
// =========================


return (

<div

style={{

minHeight:"100vh",

background:"#071426",

color:"#fff",

padding:30

}}

>


{/* HEADER */}

<div

style={{

display:"flex",

alignItems:"center",

gap:20

}}

>


<button

onClick={()=>navigate("/admin")}

style={{

background:"#facc15",

color:"#111",

border:0,

padding:"10px 20px",

borderRadius:10,

cursor:"pointer",

fontWeight:"bold"

}}

>

← Back

</button>



<h1>

Manual Wallet Adjust

</h1>



</div>





{/* SEARCH */}

<div

style={{

display:"flex",

alignItems:"center",

gap:10,

marginTop:30

}}

>


<Search size={30}/>


<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Search Member ID / Phone / Email / Name"

style={{

flex:1,

padding:15,

borderRadius:10,

fontSize:16

}}

/>


</div>







{/* USER TABLE */}


<h2

style={{

marginTop:30

}}

>

Users

</h2>




<div

style={{

overflowX:"auto"

}}

>


<table

style={{

width:"100%",

borderCollapse:"collapse",

background:"#111d32",

borderRadius:15

}}

>


<thead>


<tr

style={{

background:"#162544",

color:"#facc15"

}}

>


<th style={th}>
ID
</th>


<th style={th}>
Name
</th>


<th style={th}>
Phone
</th>


<th style={th}>
Email
</th>


<th style={th}>
Balance
</th>


</tr>


</thead>



<tbody>


{

result.map((u)=>(


<tr

key={u.id}

onClick={()=>openUser(u)}

style={{

cursor:"pointer",

background:

selected?.id===u.id

?

"#064e3b"

:

"transparent"

}}

>


<td style={td}>

{u.member_id}

</td>



<td style={td}>

{u.first_name}

{" "}

{u.last_name}

</td>



<td style={td}>

{u.phone || "-"}

</td>



<td style={td}>

{u.email || "-"}

</td>



<td style={td}>

{

wallet?.user_id===u.id

?

wallet.balance

:

"-"

}

 USDT

</td>



</tr>


))


}


</tbody>



</table>


</div>







{/* WALLET CONTROL */}



{

selected && wallet &&


<div

style={{

marginTop:30,

background:"#111d32",

padding:25,

borderRadius:15

}}

>


<h2>

Selected User

</h2>



<p>

ID :

{selected.member_id}

</p>



<p>

Name :

{selected.first_name}

{" "}

{selected.last_name}

</p>



<p>

Phone :

{selected.phone}

</p>



<h1

style={{

color:"#00eaff"

}}

>

{wallet.balance}

 USDT

</h1>




<input

type="number"

value={amount}

onChange={(e)=>setAmount(e.target.value)}

placeholder="Amount"

style={{

width:"100%",

padding:15,

borderRadius:10,

fontSize:18

}}

/>





<div

style={{

display:"flex",

gap:15,

marginTop:20

}}

>



<button

onClick={()=>changeMoney("add")}

style={{

flex:1,

background:"#16a34a",

color:"#fff",

border:0,

padding:15,

borderRadius:10,

fontSize:18,

fontWeight:"bold",

cursor:"pointer"

}}

>

<Plus/>

 Add Money

</button>







<button

onClick={()=>changeMoney("remove")}

style={{

flex:1,

background:"#dc2626",

color:"#fff",

border:0,

padding:15,

borderRadius:10,

fontSize:18,

fontWeight:"bold",

cursor:"pointer"

}}

>

<Minus/>

 Remove Money

</button>



</div>




<p

style={{

color:"#00eaff"

}}

>

{msg}

</p>



</div>


}



</div>


);


}