import { 
  useEffect, 
  useState, 
  useRef 
} from "react";

import {
  Send,
  Search,
  User,
  Clock,
  ArrowLeft
} from "lucide-react";

import { supabase } from "../../lib/supabase";

import "../../styles/adminSupportChat.css";
import { useNavigate } from "react-router-dom";


export default function AdminSupportChat(){

const navigate = useNavigate();

const [rooms,setRooms] = useState([]);

const [selectedRoom,setSelectedRoom] = useState(null);

const [messages,setMessages] = useState([]);

const [text,setText] = useState("");

const [search,setSearch] = useState("");

const bottomRef = useRef(null);

const selectedRoomRef = useRef(null);



/*
========================
โหลดห้องแชท
========================
*/

useEffect(()=>{

loadRooms();


const channel = supabase

.channel("admin-support-chat")


.on(

"postgres_changes",

{

event:"*",

schema:"public",

table:"chat_messages"

},


(payload)=>{

const room = selectedRoomRef.current;

const row = payload.new || payload.old;

if(

room &&
row &&
row.room_id === room.id

){

loadMessages(room.id);

}

loadRooms();

}


)


.subscribe();



return ()=>{

supabase.removeChannel(channel);

};


},[]);





/*
========================
ดึงรายการห้อง
========================
*/


async function loadRooms(){


const {data,error}

=

await supabase

.from("chat_rooms")

.select("*")

.order(

"last_time",

{

ascending:false

}

);



if(error){

console.log(error);

return;

}



setRooms(data || []);


}





/*
========================
โหลดข้อความในห้อง
========================
*/


async function loadMessages(roomId){


const {

data,

error

}

=

await supabase

.from("chat_messages")

.select("*")

.eq(

"room_id",

roomId

)

.order(

"created_at",

{

ascending:true

}

);



if(error){

console.log(error);

return;

}



await supabase

.from("chat_messages")

.update({

    is_read:true

})

.eq("room_id", roomId)

.eq("sender","user")

.eq("is_read",false);


// โหลดใหม่หลังจากอัปเดต
const { data: newData } = await supabase

.from("chat_messages")

.select("*")

.eq("room_id", roomId)

.order("created_at",{

    ascending:true

});

setMessages(newData || []);

requestAnimationFrame(()=>{

    bottomRef.current?.scrollIntoView({

        behavior:"smooth"

    });

});




}





/*
========================
เปิดห้องลูกค้า
========================
*/


async function openRoom(room){


setSelectedRoom(room);


selectedRoomRef.current = room;






// ล้างจำนวนข้อความใหม่ของห้อง
await supabase

.from("chat_rooms")

.update({

unread_admin:0

})

.eq(

"id",

room.id

);

// ตรวจสอบว่าห้องนี้เคยมีข้อความจาก Admin หรือยัง
const { data: adminMessages } = await supabase

.from("chat_messages")

.select("id")

.eq("room_id", room.id)

.eq("sender", "admin");


// ถ้ายังไม่มีข้อความจาก Admin เลย
if ((adminMessages || []).length === 0) {

    await supabase

    .from("chat_messages")

    .insert({

    room_id: room.id,

    user_id: room.user_id,

    sender: "admin",

    message:
"Hello, welcome to Trust. If you have any questions, please leave a message and our staff will get back to you shortly.",

    is_read:false

});

    await supabase

.from("chat_rooms")

.update({

last_message:
"Hello, welcome to Trust. If you have any questions, please leave a message and our staff will get back to you shortly.",

last_time:new Date()

})

.eq("id",room.id);

}

await loadMessages(room.id);

await loadRooms();

const { data: roomData } = await supabase

.from("chat_rooms")

.select("*")

.eq("id", room.id)

.single();

if(roomData){

    setSelectedRoom(roomData);

    selectedRoomRef.current = roomData;

}


}




/*
========================
ส่งข้อความ Admin
========================
*/


async function sendMessage(){


const message = text.trim();



if(!message){

return;

}



if(!selectedRoom){

return;

}



const {error}


=

await supabase

.from("chat_messages")

.insert({

room_id:selectedRoom.id,

user_id:selectedRoom.user_id,

sender:"admin",

message:message,

is_read:false

});



if(error){

console.log(error);

return;

}



await supabase

.from("chat_rooms")

.update({

last_message:message,

last_time:new Date(),

unread_user:
Number(selectedRoom.unread_user || 0)+1,

unread_admin:0

})

.eq("id",selectedRoom.id);



setText("");



await loadMessages(
selectedRoom.id
);


await loadRooms();

const { data: roomData } = await supabase

.from("chat_rooms")

.select("*")

.eq("id", selectedRoom.id)

.single();

if(roomData){

    setSelectedRoom(roomData);

    selectedRoomRef.current = roomData;

}


}

/*
========================
ค้นหาห้อง
========================
*/

const filteredRooms = rooms.filter((room)=>{

const keyword =
search.toLowerCase();


return (

room.customer_name
?.toLowerCase()
.includes(keyword)

||

room.member_id
?.toString()
.includes(keyword)

);

});





return (

<div className="admin-support-page">


{/* ======================
SIDEBAR
====================== */}

<div className="support-sidebar">


<div className="sidebar-title">

<button
    className="back-button"
    onClick={() => navigate("/admin")}
>
    <ArrowLeft size={20}/>
</button>

<span>Customer Support</span>

</div>



<div className="search-box">


<Search size={18}/>


<input

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

placeholder="ค้นหาลูกค้า..."

/>


</div>




<div className="room-list">


{

filteredRooms.map((room)=>(


<div

key={room.id}

className={

selectedRoom?.id === room.id

?

"chat-room active"

:

"chat-room"

}

onClick={()=>openRoom(room)}

>


<div className="room-avatar">

<User size={22}/>

</div>



<div className="room-info">


<div className="room-name">

{room.customer_name || "Customer"}

</div>



<div className="room-id">

ID : {room.member_id}

</div>



<div className="last-message">

{room.last_message || "ยังไม่มีข้อความ"}

</div>



</div>



{


room.unread_admin > 0 && (


<div className="unread-badge">

{room.unread_admin}

</div>


)


}



</div>


))


}



</div>


</div>






{/* ======================
CHAT AREA
====================== */}


<div className="support-chat-area">



{

selectedRoom ?


<>



{/* HEADER */}

<div className="chat-header">


<div>


<div className="chat-customer-name">

{selectedRoom.customer_name}

</div>



<div className="chat-customer-id">

ID : {selectedRoom.member_id}

</div>


</div>


</div>






{/* MESSAGE AREA */}

<div className="message-area">


{


messages.map((msg)=>(


<div

key={msg.id}

className={

msg.sender === "admin"

?

"message-row customer"

:

"message-row admin"

}

>



<div className="message-bubble">


<div
style={{
whiteSpace:"pre-wrap",
wordBreak:"break-word"
}}
>

{msg.message}

</div>



<div className="message-time">

<Clock size={12}/>

{new Date(msg.created_at)
.toLocaleString(
"th-TH",
{
day:"2-digit",
month:"2-digit",
year:"numeric",
hour:"2-digit",
minute:"2-digit"
}
)}

{
msg.sender==="admin" && (

<span style={{marginLeft:8}}>

{msg.is_read ? "✓✓" : "✓"}

</span>

)
}

</div>



</div>



</div>


))


}


<div ref={bottomRef}/>


</div>

{/* ======================
INPUT AREA
====================== */}


<div className="chat-input-area">


<textarea

value={text}

onChange={(e)=>setText(e.target.value)}

onKeyDown={(e)=>{

if(e.key==="Enter" && !e.shiftKey){

e.preventDefault();

sendMessage();

}

}}

placeholder="พิมพ์ข้อความ..."

rows={1}

className="chat-input"

/>



<button

className="send-button"

onClick={sendMessage}

>

<Send size={20}/>

</button>



</div>


</>



:

(


<div className="empty-chat">


เลือกห้องสนทนา


</div>


)


}



</div>


</div>


);


}