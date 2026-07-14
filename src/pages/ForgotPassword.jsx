import {useState} from "react";
import {supabase} from "../lib/supabase";
import {useToast} from "../context/ToastContext";


export default function ForgotPassword(){

const [email,setEmail]=useState("");

const {showToast}=useToast();


const sendReset=async()=>{


const {data,error}=await supabase
.from("profiles")
.select("*")
.eq("email",email)
.single();


if(error || !data){

showToast(
"ไม่พบ Email นี้",
"error"
);

return;

}


// เก็บ user id ไว้
localStorage.setItem(
"resetUser",
JSON.stringify(data)
);


showToast(
"ยืนยัน Email สำเร็จ",
"success"
);


// ไปหน้าเปลี่ยนรหัส

window.location.href="/reset-password";


}



return (

<div
style={{
minHeight:"100vh",
background:"#050b18",
display:"flex",
justifyContent:"center",
alignItems:"center"
}}
>


<div
style={{
width:"350px",
background:"#111b30",
padding:"30px",
borderRadius:"20px"
}}
>


<h2
style={{
color:"#fff",
textAlign:"center"
}}
>
ลืมรหัสผ่าน
</h2>


<input

placeholder="Email"

value={email}

onChange={
e=>setEmail(e.target.value)
}

style={{
width:"100%",
padding:"15px",
borderRadius:"12px",
marginTop:"20px"
}}

/>


<button

onClick={sendReset}

style={{
width:"100%",
marginTop:"20px",
padding:"15px",
borderRadius:"12px",
background:"#008cff",
color:"#fff",
border:"none"
}}

>
ดำเนินการต่อ
</button>


</div>


</div>

)


}