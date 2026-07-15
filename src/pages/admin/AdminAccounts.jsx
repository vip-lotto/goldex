import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

import {
    ArrowLeft,
    ShieldCheck,
    UserPlus,
    Eye,
    EyeOff,
    KeyRound,
    Trash2
} from "lucide-react";

import "./AdminAccounts.css";

export default function AdminAccounts(){

const navigate=useNavigate();

const [admins,setAdmins]=useState([]);

const [loading,setLoading]=useState(false);

const [message,setMessage]=useState("");

const [processing,setProcessing]=useState(false);

const [showPassword,setShowPassword]=useState({});

const [showAdd,setShowAdd]=useState(false);

const [showChangePassword,setShowChangePassword]=useState(false);

const [showDelete,setShowDelete]=useState(false);

const [selectedAdmin,setSelectedAdmin]=useState(null);

const [username,setUsername]=useState("");

const [password,setPassword]=useState("");

const [newPassword,setNewPassword]=useState("");

// Add Admin Form

const [addUsername,setAddUsername]=useState("");

const [addPassword,setAddPassword]=useState("");

useEffect(()=>{

loadAdmins();

},[]);

async function loadAdmins(){

setLoading(true);

const {data,error}=await supabase

.from("admin_users")

.select("*")

.neq("id",1)

.order("id");

if(error){

console.log(error);

setMessage(error.message);

setLoading(false);

return;

}

setAdmins(data||[]);

setLoading(false);

}

function togglePassword(id){

setShowPassword(prev=>({

...prev,

[id]:!prev[id]

}));

}

// ==========================
// ADD ADMIN
// ==========================

async function addAdmin(){

if(!addUsername.trim()){

    setProcessing(false);

    alert("Please enter username");

    return;

}

if(!addPassword.trim()){

    setProcessing(false);

    alert("Please enter password");

    return;

}

const {data:exist}=await supabase

.from("admin_users")

.select("id")

.eq("username",addUsername)

.maybeSingle();

if(exist){

setProcessing(false);

alert("Username already exists");

return;

}

setProcessing(true);

const {error}=await supabase

.from("admin_users")

.insert({

username:addUsername,

password:addPassword

});

if(error){

alert(error.message);

setProcessing(false);

return;

}

alert("Admin created");

setShowAdd(false);

setAddUsername("");

setAddPassword("");

await loadAdmins();

setProcessing(false);

}

// ==========================
// CHANGE PASSWORD
// ==========================

async function changePassword(){

if(selectedAdmin.id===1){

    setProcessing(false);

    alert("Super Admin is protected");

    return;

}

setProcessing(true);

if(!newPassword.trim()){

setProcessing(false);

alert("Please enter new password");

return;

}

const {error}=await supabase

.from("admin_users")

.update({

password:newPassword

})

.eq("id",selectedAdmin.id);

if(error){


setProcessing(false);

alert(error.message);

return;

}

alert("Password updated");

setShowChangePassword(false);

setSelectedAdmin(null);

setNewPassword("");

await loadAdmins();

setProcessing(false);

}

// ==========================
// DELETE ADMIN
// ==========================

async function deleteAdmin(){

if(!selectedAdmin){

    setProcessing(false);

    return;

}

setProcessing(true);

if(selectedAdmin.id===1){

setProcessing(false);

alert("Cannot delete Super Admin");

return;

}

const {error}=await supabase

.from("admin_users")

.delete()

.eq("id",selectedAdmin.id);

if(error){

alert(error.message);

setProcessing(false);

return;

}

alert("Admin deleted");

setShowDelete(false);

setSelectedAdmin(null);

await loadAdmins();

setProcessing(false);

}

return(

<div className="admin-accounts-page">

<div className="admin-accounts-header">

<button

className="back-btn"

onClick={()=>navigate("/admin")}

>

<ArrowLeft size={18}/>

Back

</button>

<h1>

Admin Management

</h1>

</div>

<div className="admin-card">

<div className="admin-title">

<ShieldCheck size={42}/>

<div>

<h2>

Administrator Accounts

</h2>

<p>

Manage administrator accounts

</p>

</div>

</div>

<div className="admin-actions">

<button

className="add-btn"

onClick={()=>setShowAdd(true)}

>

<UserPlus size={18}/>

Add Admin

</button>

</div>

</div>

<div className="table-card">

<table>

<thead>

<tr>

<th>ID</th>

<th>Username</th>

<th>Password</th>

<th>Created</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{

loading

?

<tr>

<td colSpan="5">

Loading...

</td>

</tr>

:

admins.map(admin=>(

<tr key={admin.id}>

<td>{admin.id}</td>

<td>{admin.username}</td>

<td>

<div className="password-box">

<span>

{

showPassword[admin.id]

?

admin.password

:

"********"

}

</span>

<button

className="eye-btn"

onClick={()=>togglePassword(admin.id)}

>

{

showPassword[admin.id]

?

<EyeOff size={18}/>

:

<Eye size={18}/>

}

</button>

</div>

</td>

<td>

{

admin.created_at

?

new Date(admin.created_at).toLocaleString()

:

"-"

}

</td>

<td>

<div className="action-buttons">

<button

className="edit-btn"

disabled={processing}

onClick={()=>{

setSelectedAdmin(admin);

setNewPassword("");

setShowChangePassword(true);

}}

>

<KeyRound size={15}/>

Change Password

</button>

<button

className="delete-btn"

disabled={processing}

onClick={()=>{

setSelectedAdmin(admin);

setShowDelete(true);

}}

>

<Trash2 size={15}/>

Delete

</button>

</div>

</td>

</tr>

))

}

</tbody>

</table>

</div>

{
showAdd && (

<div className="popup-overlay">

<div className="popup-card">

<h2>

Add Administrator

</h2>

<input

className="popup-input"

placeholder="Username"

value={addUsername}

onChange={(e)=>setAddUsername(e.target.value)}

/>

<input

className="popup-input"

placeholder="Password"

value={addPassword}

onChange={(e)=>setAddPassword(e.target.value)}

/>

<div className="popup-buttons">

<button

className="cancel-btn"

onClick={()=>{

setShowAdd(false);

setAddUsername("");

setAddPassword("");

setProcessing(false);

}}

>

Cancel

</button>

<button

className="save-btn"

disabled={processing}

onClick={addAdmin}

>

Create

</button>

</div>

</div>

</div>

)
}

{/* ================= CHANGE PASSWORD ================= */}

{
showChangePassword && (

<div className="popup-overlay">

<div className="popup-card">

<h2>Change Password</h2>

<p>

{selectedAdmin?.username}

</p>

<input

className="popup-input"

placeholder="New Password"

value={newPassword}

onChange={(e)=>setNewPassword(e.target.value)}

/>

<div className="popup-buttons">

<button
className="cancel-btn"

onClick={()=>{

setShowChangePassword(false);

setSelectedAdmin(null);

setNewPassword("");

setProcessing(false);

}}

>

Cancel

</button>

<button
className="save-btn"
disabled={processing}
onClick={changePassword}
>

Save

</button>

</div>

</div>

</div>

)

}

{/* ================= DELETE ADMIN ================= */}

{
showDelete && (

<div className="popup-overlay">

<div className="popup-card">

<h2>

Delete Administrator

</h2>

<p>

Are you sure you want to delete

<br/>

<b>

{selectedAdmin?.username}

</b>

?

</p>

<div className="popup-buttons">

<button

className="cancel-btn"

onClick={()=>{

setShowDelete(false);

setSelectedAdmin(null);

setProcessing(false);

}}

>

Cancel

</button>

<button

className="delete-btn"

disabled={processing}

onClick={deleteAdmin}

>

Delete

</button>

</div>

</div>

</div>

)

}

</div>

);

}