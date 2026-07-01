import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminWithdraw() {

  const [withdraws, setWithdraws] =
    useState([]);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadWithdraws();
  }, []);

  const loadWithdraws = async () => {

    const { data } =
      await supabase
        .from("withdrawals")
        .select("*")
        .order(
          "created_at",
          {
            ascending:false
          }
        );

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

    if (!wallet) {

      alert(
        "ไม่พบ Wallet"
      );

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

    await supabase
      .from("wallets")
      .update({

        balance:
          Number(
            wallet.balance
          ) -
          Number(
            item.amount
          )

      })
      .eq(
        "user_id",
        item.user_id
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

        user_id:
          item.user_id,

        title:
          "ถอนเงินสำเร็จ",

        message:
`Coin : ${item.coin}

Network : ${item.network}

Amount : ${item.amount}

สถานะ : สำเร็จ`,

        is_read:
          false

      });

    alert(
      "อนุมัติสำเร็จ"
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

      user_id:
        item.user_id,

      title:
        "กำลังตรวจสอบรายการถอน",

      message:
        "รายการถอนของคุณกำลังอยู่ระหว่างการตรวจสอบ",

      is_read:false

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

        user_id:
          item.user_id,

        title:
          "ถอนเงินถูกปฏิเสธ",

        message:
          message ||
          "รายการถอนถูกปฏิเสธ",

        is_read:
          false

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

      <h2
        style={{
          color:"#facc15",
          marginBottom:"20px"
        }}
      >
        Withdraw Management
      </h2>

      {withdraws.map(
        (item) => (

        <div
          key={item.id}
          style={{
            background:"#10203d",
            padding:"20px",
            borderRadius:"15px",
            marginBottom:"15px"
          }}
        >

          <p>
            ID :
            {item.id}
          </p>

          <p>
            USER :
            {item.user_id}
          </p>

          <p>
            TYPE :
            {item.type}
          </p>

          <p>
            AMOUNT :
            {item.amount}
          </p>

          <p>
            STATUS :
            {item.status}
          </p>

          {
            item.type ===
            "crypto" && (
              <>
                <p>
                  COIN :
                  {item.coin}
                </p>

                <p>
                  NETWORK :
                  {item.network}
                </p>

                <p>
                  ADDRESS :
                  {item.address}
                </p>

                {
                  item.qr_image && (

                    <img
                      src={
                        item.qr_image
                      }
                      alt=""
                      style={{
                        width:"180px",
                        marginTop:"10px",
                        borderRadius:"10px"
                      }}
                    />

                  )
                }

              </>
            )
          }

          {
            item.type ===
            "bank" && (
              <>
                <p>
                  BANK :
                  {item.bank_name}
                </p>

                <p>
                  ACCOUNT :
                  {
                    item.bank_account_name
                  }
                </p>

                <p>
                  NUMBER :
                  {
                    item.bank_account_number
                  }
                </p>
              </>
            )
          }

          <textarea
            placeholder="ข้อความถึงลูกค้า"
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            style={{
              width:"100%",
              height:"80px",
              marginTop:"10px",
              borderRadius:"10px",
              padding:"10px"
            }}
          />

          {(
  item.status === "pending" ||
  item.status === "processing"
) ? (

  <div
    style={{
      display:"flex",
      gap:"10px",
      marginTop:"10px"
    }}
  >

    <button
      onClick={() =>
        approveWithdraw(item)
      }
      style={{
        background:"#16a34a",
        color:"#fff",
        border:"none",
        padding:"10px 20px",
        borderRadius:"10px",
        cursor:"pointer"
      }}
    >
      Approve
    </button>

    {
  item.status === "pending" && (

    <button
      onClick={() =>
        processingWithdraw(item)
      }
      style={{
        background:"#f59e0b",
        color:"#fff",
        border:"none",
        padding:"10px 20px",
        borderRadius:"10px",
        cursor:"pointer"
      }}
    >
      Processing
    </button>

  )
}

    <button
      onClick={() =>
        rejectWithdraw(item)
      }
      style={{
        background:"#dc2626",
        color:"#fff",
        border:"none",
        padding:"10px 20px",
        borderRadius:"10px",
        cursor:"pointer"
      }}
    >
      Reject
    </button>

  </div>

) : (

  <div
    style={{
      marginTop:"10px",
      fontWeight:"bold",
      color:
        item.status === "approved"
? "#22c55e"
: item.status === "processing"
? "#f59e0b"
: "#ef4444"
    }}
  >
    {
item.status === "approved"
? "✅ อนุมัติแล้ว"
: item.status === "processing"
? "⏳ กำลังตรวจสอบ"
: "❌ ปฏิเสธแล้ว"
}
  </div>

)}

        </div>

      ))}

    </div>

  );
}