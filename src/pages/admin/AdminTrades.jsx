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

const [currentTrades,setCurrentTrades] = useState([]);

const [users,setUsers] = useState([]);

const [selectedUser,setSelectedUser] = useState("");

const [loading,setLoading] = useState(false);

const [message,setMessage] = useState("");

const [search,setSearch] = useState("");

// =========================
// START LOAD
// =========================

useEffect(()=>{

    loadTrades();

    loadUsers();


    const channel = supabase
    .channel("admin-trades-live")


    .on(
        "postgres_changes",
        {
            event:"*",
            schema:"public",
            table:"trades"
        },
        (payload)=>{


            console.log(
                "TRADE UPDATE",
                payload
            );


            loadTrades();


        }
    )


    .subscribe();



    return()=>{

        supabase.removeChannel(channel);

    };


},[]);

// =========================
// LOAD TRADES
// =========================

const loadTrades = async()=>{

    setLoading(true);

    const {

        data,

        error

    } = await supabase

    .from("trades")

    .select("*")

    .order(
        "created_at",
        {
            ascending:false
        }
    )

    .limit(30);

    if(error){

        console.log(error);

        setLoading(false);

        return;

    }

    setTrades(data || []);


setCurrentTrades(

(data || [])

.filter(
trade =>
trade.status === "trading"
)

.sort(
(a,b)=>
new Date(b.created_at)
-
new Date(a.created_at)
)

);


setLoading(false);

};

// =========================
// LOAD USERS
// =========================

const loadUsers = async()=>{

    const {

        data,

        error

    } = await supabase

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

    loadUsers();

};

// =========================
// WIN ALL / LOSE ALL
// =========================

const setAllResult = async(mode)=>{

    const { data:old } = await supabase

    .from("trade_control")

    .select("*")

    .eq("id",1)

    .maybeSingle();

    if(old){

        const { error } = await supabase

        .from("trade_control")

        .update({

            global_result: mode

        })

        .eq("id",1);

        if(error){

            alert(error.message);

            return;

        }

    }else{

        const { error } = await supabase

        .from("trade_control")

        .insert({

            id:1,

            global_result: mode

        })

        if(error){

            alert(error.message);

            return;

        }

    }

    // ======================================
// อัปเดตทุกคนใน trade_user_control
// ======================================

const { data: allUsers } = await supabase
.from("profiles")
.select("id");

for (const user of (allUsers || [])) {

    const { data: oldUser } = await supabase
    .from("trade_user_control")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

    if (oldUser) {

        await supabase
        .from("trade_user_control")
        .update({
            mode: mode
        })
        .eq("user_id", user.id);

    } else {

        await supabase
        .from("trade_user_control")
        .insert({
            user_id: user.id,
            mode: mode
        });

    }

}

    setMessage(

        `ALL ${mode.toUpperCase()}`

    );

};

// =========================
// USER WIN / LOSE
// =========================

const setUserResult = async(mode)=>{

    if(!selectedUser){

        alert("Please select user");

        return;

    }

    const { data:old } = await supabase

    .from("trade_user_control")

    .select("*")

    .eq("user_id",selectedUser)

    .maybeSingle();

    if(old){

        const { error } = await supabase

        .from("trade_user_control")

        .update({

            mode

        })

        .eq("user_id",selectedUser);

        if(error){

            alert(error.message);

            return;

        }

    }else{

        const { error } = await supabase

        .from("trade_user_control")

        .insert({

            user_id:selectedUser,

            mode

        });

        if(error){

            alert(error.message);

            return;

        }

    }

    setMessage(

        `USER ${mode.toUpperCase()}`

    );

};

// =========================
// FORCE RESULT
// =========================
const forceResult = async(trade,result)=>{


if(trade.status !== "trading"){

alert("Trade already finished");

return;

}



const {error}=await supabase

.from("trades")

.update({

admin_result: result

})

.eq(
"id",
trade.id
)

.eq(
"status",
"trading"
);



if(error){

alert(error.message);

return;

}



alert(
`ROUND ${trade.id} ${result.toUpperCase()}`
);


await loadTrades();


};

// =========================
// GET USER NAME
// =========================

const getUserName = (id)=>{

    const user = users.find(

        u=>u.id===id

    );

    if(!user){

        return id;

    }

    return(

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
// FORMAT NUMBER
// =========================

const filteredUsers = users.filter(user => {

    const keyword = search.toLowerCase();

    return (

        String(user.member_id || "")
        .toLowerCase()
        .includes(keyword)

        ||

        `${user.first_name || ""} ${user.last_name || ""}`
        .toLowerCase()
        .includes(keyword)

    );

});

const formatNumber = (num)=>{

    return Number(

        num || 0

    ).toLocaleString();

};

// =========================
// UI
// =========================

return(

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

ALL USER CONTROL

</h2>


<button

onClick={()=>setAllResult("win")}

style={{

background:"#16a34a98",

color:"#ffffff9c",

padding:"12px 24px",

border:0,

borderRadius:10,

marginRight:10,

cursor:"pointer"

}}

>

WIN ALL

</button>

<button

onClick={()=>setAllResult("lose")}

style={{

background:"#dc262691",

color:"#ffffff9c",

padding:"12px 24px",

border:0,

borderRadius:10,

cursor:"pointer"

}}

>

LOSE ALL

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

USER CONTROL

</h2>

<input
    type="text"
    placeholder="Search UID / Name..."
    value={search}
    onChange={(e)=>setSearch(e.target.value)}
    style={{
        width:"100%",
        padding:"10px",
        marginBottom:"15px",
        borderRadius:"8px",
        border:"1px solid #555",
        background:"#1c2740",
        color:"#fff"
    }}
/>

<select

value={selectedUser}

onChange={

e=>setSelectedUser(

e.target.value

)

}

style={{

padding:10,

borderRadius:8,

minWidth:260

}}

>

<option value="">

Select User

</option>

{

filteredUsers.map(user=>(

<option

key={user.id}

value={user.id}

>

{user.member_id}

-

{user.first_name}

{" "}

{user.last_name}

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

borderRadius:8,

cursor:"pointer"

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

borderRadius:8,

cursor:"pointer"

}}

>

USER LOSE

</button>

</div>

<div>

<h2>
🔥 Current Trading
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

<th>Amount</th>

<th>Duration</th>

<th>Status</th>

<th>Action</th>

</tr>

</thead>


<tbody>


{
currentTrades.map(item=>(


<tr key={item.id}>


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
{formatNumber(item.amount)}
</td>


<td>
{item.duration} นาที
</td>


<td>
Running
</td>


<td>


<button

onClick={()=>forceResult(item,"win")}

style={{

background:"#16a34a",
color:"#fff",
padding:"8px 15px",
border:0,
borderRadius:8,
marginRight:8

}}

>

WIN

</button>



<button

onClick={()=>forceResult(item,"lose")}

style={{

background:"#dc2626",
color:"#fff",
padding:"8px 15px",
border:0,
borderRadius:8

}}

>

LOSE

</button>



</td>


</tr>


))

}


</tbody>


</table>


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

).toLocaleString()

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