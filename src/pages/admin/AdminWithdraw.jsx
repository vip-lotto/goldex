import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./AdminWithdraw.css";

export default function AdminWithdraw() {

  const navigate = useNavigate();

  const [withdraws, setWithdraws] =
    useState([]);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadWithdraws();
  }, []);

  const loadWithdraws = async () => {

    const { data, error } =
  await supabase
    .from("withdrawals")
    .select("*")
    .order(
      "created_at",
      {
        ascending:false
      }
    );

console.log("withdraw data =", data);
console.log("withdraw error =", error);

if(data){
  setWithdraws(data);
}
  };

  const approveWithdraw =
  async (item) => {

    if (
  item.status === "approved" ||
  item.status === "rejected"
) {

  alert(
    "รายการนี้ถูกดำเนินการแล้ว"
  );

  return;
}

    const { data: wallet } =
      await supabase
        .from("wallets")
        .select("*")
        .eq(
          "user_id",
          item.user_id
        )
        .single();

        const { data: profile } =
  await supabase
    .from("profiles")
    .select("*")
    .eq(
      "id",
      item.user_id
    )
    .single();

const { data: asset } =
  await supabase
    .from("user_assets")
    .select("*")
    .eq(
      "user_id",
      item.user_id
    )
    .eq(
      "symbol",
      "USDT"
    )
    .single();

    if (!wallet) {

      alert(
        "ไม่พบ Wallet"
      );

      return;
    }

    if (!profile) {
  alert("ไม่พบ Profile");
  return;
}

if (!asset) {
  alert("ไม่พบ USDT Asset");
  return;
}


    if (
      Number(wallet.balance) <
      Number(item.amount)
    ) {

      alert(
        "ยอดเงินไม่พอ"
      );

      return;
    }

    const newProfileBalance =
  Number(profile.balance) -
  Number(item.amount);

const newWalletBalance =
  Number(wallet.balance) -
  Number(item.amount);

const newAssetBalance =
  Number(asset.balance) -
  Number(item.amount);


    await supabase
  .from("profiles")
  .update({

    balance: newProfileBalance

  })
  .eq(
    "id",
    item.user_id
  );

await supabase
  .from("wallets")
  .update({

    balance: newWalletBalance

  })
  .eq(
    "user_id",
    item.user_id
  );

await supabase
  .from("user_assets")
  .update({

    balance: newAssetBalance

  })
  .eq(
    "id",
    asset.id
  );

    await supabase
      .from("withdrawals")
      .update({

        status:
          "approved",

        admin_message:
          message

      })
      .eq(
        "id",
        item.id
      );

    await supabase
  .from("notifications")
  .insert({

    user_id: item.user_id,

    title_key: "withdrawSuccess",

    message_key: "withdrawApproved",

    coin: item.coin,

    network: item.network,

    amount: Number(item.amount),

    status: "success",

    type: "withdraw",

    is_read: false

  });

      await supabase
  .from("transactions")
  .insert({

    user_id: item.user_id,

    type: "withdraw",

    amount: item.amount,

    status: "completed",

    description: `Withdraw ${item.coin}`

  });

    alert(
  "อนุมัติสำเร็จ"
);

window.dispatchEvent(
  new Event("walletUpdated")
);

loadWithdraws();

};

    const processingWithdraw =
async (item) => {

  if (
    item.status !== "pending"
  ) {

    alert(
      "รายการนี้ถูกดำเนินการแล้ว"
    );

    return;
  }

  await supabase
    .from("withdrawals")
    .update({
      status:"processing"
    })
    .eq(
      "id",
      item.id
    );

  await supabase
  .from("notifications")
  .insert({

    user_id: item.user_id,

    title_key: "withdrawProcessing",

    message_key: "withdrawProcessingMessage",

    status: "processing",

    type: "withdraw",

    is_read: false

  });

  loadWithdraws();

};


  const rejectWithdraw =
    async (item) => {

        if (
  item.status === "approved"
) {

  alert(
    "รายการนี้อนุมัติแล้ว"
  );

  return;
}

    await supabase
      .from("withdrawals")
      .update({

        status:
          "rejected",

        admin_message:
          message

      })
      .eq(
        "id",
        item.id
      );

    await supabase
  .from("notifications")
  .insert({

    user_id: item.user_id,

    title_key: "withdrawFailed",

    message_key: "withdrawRejected",

    coin: item.coin,

    network: item.network,

    amount: Number(item.amount),

    status: "failed",

    type: "withdraw",

    is_read: false

  });

    alert(
      "ปฏิเสธสำเร็จ"
    );

    loadWithdraws();
  };

  return (

    <div
      style={{
        padding:"20px",
        color:"#fff",
        background:"#06152d",
        minHeight:"100vh"
      }}
    >

      <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px"
  }}
>

  <button
    onClick={() => navigate(-1)}
    style={{
      background: "#1e3a8a",
      color: "#fff",
      border: "none",
      padding: "10px 18px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "bold"
    }}
  >
    ← Back
  </button>

  <h2
    style={{
      color: "#facc15",
      margin: 0
    }}
  >
    Withdraw Management
  </h2>

  <div style={{ width: "80px" }} />

</div>

      <div className="withdraw-table">

<table>

<thead>

<tr>

<th>ID</th>

<th>User</th>

<th>Coin</th>

<th>Network</th>

<th>Amount</th>

<th>Status</th>

<th>Date</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{withdraws.map(item=>(

<tr key={item.id}>

<td>#{item.id}</td>

<td>{item.user_id}</td>

<td>{item.coin}</td>

<td>{item.network}</td>

<td>{item.amount}</td>

<td>

{item.status}

</td>

<td>

{new Date(item.created_at).toLocaleString()}

</td>

<td>

{item.status==="pending" ||

item.status==="processing"

?

<>

<button

onClick={()=>approveWithdraw(item)}

>

Approve

</button>

<button

onClick={()=>rejectWithdraw(item)}

>

Reject

</button>

</>

:

<span>

Completed

</span>

}

</td>

</tr>

))}

</tbody>

</table>

</div>

    </div>

  );
}