import {useState} from "react";
import {supabase} from "../lib/supabase";


export default function ResetPassword(){

const [password,setPassword]=useState("");


const changePassword=async()=>{


const user =
JSON.parse(
localStorage.getItem("resetUser")
);


await supabase
.from("profiles")
.update({
password:password
})
.eq(
"id",
user.id
);


alert("เปลี่ยนรหัสผ่านแล้ว");


window.location.href="/login";


}



return(

<div>

<h2>
ตั้งรหัสผ่านใหม่
</h2>


<input

type="password"

placeholder="รหัสใหม่"

onChange={
e=>setPassword(e.target.value)
}

/>


<button
onClick={changePassword}
>
ยืนยัน
</button>


</div>

)


}