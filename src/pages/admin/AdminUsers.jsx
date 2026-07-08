
import { useEffect, useMemo, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AdminUsers() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [editingUser, setEditingUser] = useState(null);

  const [wallet, setWallet] = useState(null);

const [bank, setBank] = useState(null);

const [deposits, setDeposits] = useState([]);

const [withdrawals, setWithdrawals] = useState([]);

const [tradeHistory, setTradeHistory] = useState([]);

const detailRef = useRef(null);

  async function loadUsers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("id", { ascending: true });

    if (!error) {
      setUsers(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);


  async function loadUserData(userId) {

  const { data: walletData } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  setWallet(walletData);

console.log(walletData);

  const { data: bankData } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("user_id", userId)
    .single();

  setBank(bankData);

  const { data: depositData } = await supabase
    .from("deposits")
    .select("*")
    .eq("user_id", userId)
    .order("id", { ascending: false });

  setDeposits(depositData || []);

  const { data: withdrawData } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("user_id", userId)
    .order("id", { ascending: false });

  setWithdrawals(withdrawData || []);

  const { data: tradeData } = await supabase
    .from("trade_history")
    .select("*")
    .eq("user_id", userId)
    .order("id", { ascending: false });

  setTradeHistory(tradeData || []);

}

  async function saveUser() {


  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: editingUser.first_name,
      last_name: editingUser.last_name,
      phone: editingUser.phone,
      email: editingUser.email,
      invite_code: editingUser.invite_code,
      balance: Number(editingUser.balance)
    })
    .eq("id", editingUser.id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Saved ID User");

 

await loadUsers();

setSelectedUser(null);
setEditingUser(null);
setWallet(null);
setBank(null);
setDeposits([]);
setWithdrawals([]);
setTradeHistory([]);
}

async function saveWallet() {

    if (!wallet) return;

    const updateData = { ...wallet };

    delete updateData.id;
    delete updateData.user_id;
    delete updateData.created_at;

    const { error } = await supabase
        .from("wallets")
        .update(updateData)
        .eq("user_id", selectedUser.id);

    if (error) {
        alert(error.message);
        return;
    }

    alert("Wallet Saved");
}

  const filteredUsers = useMemo(() => {
    if (!search) return users;

    const keyword = search.toLowerCase();

    return users.filter((u) => {
      return (
        String(u.id).includes(keyword) ||
        String(u.member_id || "").includes(keyword) ||
        String(u.first_name || "").toLowerCase().includes(keyword) ||
        String(u.last_name || "").toLowerCase().includes(keyword) ||
        String(u.phone || "").includes(keyword) ||
        String(u.email || "").toLowerCase().includes(keyword)
      );
    });
  }, [users, search]);

  return (
    <div
      style={{
        background: "#020f2d",
        minHeight: "100vh",
        color: "#fff",
        padding: 30
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>👥 Admin Users</h1>

          <div
            style={{
              color: "#8ea6d8",
              marginTop: 5
            }}
          >
            Total Users : {users.length}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={buttonStyle}
          >
            ← Back
          </button>

          <button
            onClick={loadUsers}
            style={buttonStyle}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search UID / Member ID / Name / Phone / Email..."
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 10,
          border: "1px solid #304878",
          background: "#071937",
          color: "#fff",
          marginBottom: 20,
          fontSize: 15
        }}
      />

      <div
        style={{
          overflowX: "auto",
          borderRadius: 12,
          background: "#071937"
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr
              style={{
                background: "#0d2857"
              }}
            >
              <th style={th}>UID</th>
              <th style={th}>Member ID</th>
              <th style={th}>Name</th>
              <th style={th}>Phone</th>
              <th style={th}>Email</th>
              <th style={th}>Balance</th>
              <th style={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: 40
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: 40
                  }}
                >
                  No User
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: "1px solid #14305d"
                  }}
                >
                  <td style={td}>{user.id}</td>

                  <td style={td}>{user.member_id}</td>

                  <td style={td}>
                    {user.first_name} {user.last_name}
                  </td>

                  <td style={td}>{user.phone}</td>

                  <td style={td}>{user.email}</td>

                  <td style={td}>
                    {Number(user.balance || 0).toLocaleString()}
                  </td>

                  <td style={td}>
                    <button
                      style={viewButton}
                      onClick={async () => {

    setSelectedUser(user);

    setEditingUser({ ...user });

    await loadUserData(user.id);

    setTimeout(() => {

        detailRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    },100);

}}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div

        ref={detailRef}

          style={{
            marginTop: 30,
            background: "#071937",
            padding: 20,
            borderRadius: 12
          }}
        >



          <h2>Customer Information</h2>

          <div

          
style={{
display:"grid",
gridTemplateColumns:"repeat(2,1fr)",
gap:15
}}
>

<div>

<label>First Name</label>

<input
value={editingUser.first_name || ""}
onChange={(e)=>
setEditingUser({
...editingUser,
first_name:e.target.value
})
}
style={inputStyle}
/>

</div>

<div>

<label>Last Name</label>

<input
value={editingUser.last_name || ""}
onChange={(e)=>
setEditingUser({
...editingUser,
last_name:e.target.value
})
}
style={inputStyle}
/>

</div>

<div>

<label>Phone</label>

<input
value={editingUser.phone || ""}
onChange={(e)=>
setEditingUser({
...editingUser,
phone:e.target.value
})
}
style={inputStyle}
/>

</div>

<div>

<label>Email</label>

<input
value={editingUser.email || ""}
onChange={(e)=>
setEditingUser({
...editingUser,
email:e.target.value
})
}
style={inputStyle}
/>

</div>

<div>

<label>Invite Code</label>

<input
value={editingUser.invite_code || ""}
onChange={(e)=>
setEditingUser({
...editingUser,
invite_code:e.target.value
})
}
style={inputStyle}
/>

</div>

<div>

<label>Balance</label>

<input
type="number"
value={editingUser.balance || 0}
onChange={(e)=>
setEditingUser({
...editingUser,
balance:e.target.value
})
}
style={inputStyle}
/>

</div>

</div>

<hr
style={{
margin:"30px 0",
borderColor:"#23395d"
}}
/>

<h2>Wallet</h2>

{wallet ? (

<div

style={{

display:"grid",

gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",

gap:15

}}

>

{Object.keys(wallet)

.filter(

key=>

![

"id",

"user_id",

"created_at"

].includes(key)

)

.map((coin)=>(

<div key={coin}>

<label>{coin.toUpperCase()}</label>

<input

style={inputStyle}

value={wallet[coin] ?? ""}

onChange={(e)=>

setWallet({

...wallet,

[coin]:e.target.value

})

}

/>

</div>

))}

</div>

) : (

<p>No Wallet</p>

)}

          <div
            style={{
              marginTop: 20,
              display: "flex",
              gap: 10,
              flexWrap: "wrap"
            }}
          >
            <button
    style={buttonStyle}
    onClick={saveUser}
>
    💾 Save
</button>

<button

style={{
...buttonStyle,
background:"#16a34a"
}}

onClick={saveWallet}

>

💰 Save Wallet

</button>

            <button style={buttonStyle}>Freeze</button>

            <button style={buttonStyle}>Unfreeze</button>

            <button style={buttonStyle}>Reset Password</button>

            <button style={buttonStyle}>Delete User</button>
          </div>
        </div>
      )}
    </div>
  );
}

const th = {
  padding: 15,
  textAlign: "left"
};

const td = {
  padding: 15
};

const buttonStyle = {
  background: "#1d4ed8",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 8,
  cursor: "pointer"
};

const viewButton = {
  background: "#10b981",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: 6,
  background: "#102549",
  color: "#fff",
  border: "1px solid #345",
  borderRadius: 8,
  fontSize: 15
};
