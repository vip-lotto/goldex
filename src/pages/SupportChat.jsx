import { 
useEffect, 
useState, 
useRef 
} from "react";

import { supabase } from "../lib/supabase";

import {
ArrowLeft,
Send,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import "../styles/supportChat.css";


export default function SupportChat(){

const { t } = useTranslation();

const [user,setUser] = useState(null);

const [room,setRoom] = useState(null);

const [messages,setMessages] = useState([]);

const [text,setText] = useState("");

const bottomRef = useRef(null);

const inputRef = useRef(null);



useEffect(()=>{

initChat();


},[]);



useEffect(()=>{


if(!room) return;


const channel = supabase

.channel(
"support-chat-user-"+room.id
)

.on(

"postgres_changes",

{

event:"*",

schema:"public",

table:"chat_messages",

filter:`room_id=eq.${room.id}`

},

(payload)=>{

const row = payload.new || payload.old;

if(row && row.room_id === room.id){

    loadMessages(room.id);

}

}

)

.subscribe();



return ()=>{

supabase.removeChannel(channel);

};



},[room]);





async function initChat(){


const loginUser =
JSON.parse(
localStorage.getItem("user")
);



if(!loginUser){

return;

}



setUser(loginUser);




const {
data:profile,
error
}
=
await supabase

.from("profiles")

.select(
"id,first_name,member_id"
)

.eq(
"id",
loginUser.id
)

.single();




if(error){

console.log(error);

return;

}





let {

data:chatRoom

}
=
await supabase

.from("chat_rooms")

.select("*")

.eq(
"user_id",
loginUser.id
)

.maybeSingle();





if(!chatRoom){



const {

data:newRoom,

error:createError

}

=
await supabase

.from("chat_rooms")

.insert({

user_id:loginUser.id,

member_id:
profile.member_id,

customer_name:
profile.first_name || "Customer",

status:"open",

last_message:"",

unread_user:0,

unread_admin:0

})

.select()

.single();




if(createError){

console.log(createError);

return;

}



chatRoom = newRoom;



}





setRoom(chatRoom);



loadMessages(chatRoom.id);



}






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




setMessages(data || []);

// ลูกค้าเปิดแชท = อ่านข้อความของแอดมินแล้ว

await supabase

.from("chat_messages")

.update({

    is_read:true

})

.eq("room_id", roomId)

.eq("sender", "admin")

.eq("is_read", false);

const { data: newData } = await supabase
.from("chat_messages")
.select("*")
.eq("room_id", roomId)
.order("created_at", {
    ascending: true
});

setMessages(newData || []);


setTimeout(()=>{

bottomRef.current?.scrollIntoView({

behavior:"smooth"

});


},100);



}

async function sendMessage(){


const message = text.trim();


if(!message){

return;

}


if(!room || !user){

return;

}




const {

error

}

=
await supabase

.from("chat_messages")

.insert({

room_id:room.id,

user_id:user.id,

sender:"user",

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

unread_admin:
Number(room.unread_admin || 0)+1

})

.eq(
"id",
room.id
);



setText("");



await loadMessages(room.id);



}




return (

<div className="support-chat-page">



<header className="support-header">


<button
className="support-back-btn"
onClick={()=>window.history.back()}
>
<ArrowLeft size={22}/>

</button>



<div className="support-title">

Customer Support

</div>


</header>





<div className="chat-box">



{

messages.map(msg=>(


<div

key={msg.id}

className={

msg.sender==="user"

?

"my-message"

:

"admin-message"

}

>


{

msg.sender==="admin" && (

<div className="admin-name">

 TRUST Support

</div>

)

}



<div
className="message-text"
style={{
    whiteSpace:"pre-wrap",
    wordBreak:"break-word"
}}
>
{msg.message}
</div>


</div>


))

}



<div ref={bottomRef}/>



</div>

<div className="chat-input">


<input

value={text}

onChange={(e)=>
setText(e.target.value)
}

onKeyDown={(e)=>{

if(e.key==="Enter"){

sendMessage();

}

}}

placeholder={t("support.typeMessage")}

 />



<button

className="send-btn"

onClick={sendMessage}

>

<Send size={22}/>

</button>



</div>



</div>

);


}