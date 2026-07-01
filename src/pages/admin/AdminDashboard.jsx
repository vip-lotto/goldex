import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminDeposit() {

  const [deposits, setDeposits] =
    useState([]);

  useEffect(() => {
    loadDeposits();
  }, []);

  const loadDeposits = async () => {

    const { data } =
      await supabase
        .from("deposits")
        .select("*")
        .order(
          "created_at",
          { ascending:false }
        );

    if(data){
      setDeposits(data);
    }
  };

  const approveDeposit =
    async (deposit) => {

    if(
      deposit.status ===
      "approved"
    ){
      return;
    }

    const { data:user } =
      await supabase
        .from("profiles")
        .select("*")
        .eq(
          "id",
          deposit.user_id
        )
        .single();

    if(!user){
      alert(
        "ไม่พบผู้ใช้"
      );
      return;
    }

    const newBalance =
      Number(user.balance || 0)
      +
      Number(deposit.amount);

    await supabase
      .from("profiles")
      .update({
        balance:newBalance
      })
      .eq(
        "id",
        deposit.user_id
      );

    await supabase
      .from("deposits")
      .update({
        status:"approved"
      })
      .eq(
        "id",
        deposit.id
      );

    await supabase
      .from("notifications")
      .insert({
        user_id:
          deposit.user_id,

        title:
          "Deposit Success",

        message:
          `ฝากเงินสำเร็จ ${deposit.amount}`,

        is_read:false
      });

    alert(
      "อนุมัติสำเร็จ"
    );

    loadDeposits();
  };

  const rejectDeposit =
    async (deposit) => {

    await supabase
      .from("deposits")
      .update({
        status:"rejected"
      })
      .eq(
        "id",
        deposit.id
      );

    await supabase
      .from("notifications")
      .insert({
        user_id:
          deposit.user_id,

        title:
          "Deposit Rejected",

        message:
          `รายการฝาก ${deposit.amount} ถูกปฏิเสธ`,

        is_read:false
      });

    alert(
      "ปฏิเสธแล้ว"
    );

    loadDeposits();
  };

  return (
    <div
      style={{
        padding:"20px",
        color:"#fff",
        background:"#020f2d",
        minHeight:"100vh"
      }}
    >

      <h2
        style={{
          color:"#facc15",
          marginBottom:"20px"
        }}
      >
        Deposit Management
      </h2>

      <table
        style={{
          width:"100%",
          borderCollapse:
            "collapse"
        }}
      >

        <thead>

          <tr>

            <th>ID</th>

            <th>User</th>

            <th>Amount</th>

            <th>Coin</th>

            <th>Network</th>

            <th>Status</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {
            deposits.map(
              (item) => (

              <tr
                key={item.id}
              >

                <td>
                  {item.id}
                </td>

                <td>
                  {item.user_id}
                </td>

                <td>
                  {item.amount}
                </td>

                <td>
                  {item.coin}
                </td>

                <td>
                  {item.network}
                </td>

                <td>
                  {item.status}
                </td>

                <td>

                  <button
                    onClick={() =>
                      approveDeposit(
                        item
                      )
                    }
                    style={{
                      background:
                        "green",
                      color:"#fff",
                      border:"none",
                      padding:
                        "8px 12px",
                      marginRight:
                        "5px",
                      cursor:
                        "pointer"
                    }}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      rejectDeposit(
                        item
                      )
                    }
                    style={{
                      background:
                        "red",
                      color:"#fff",
                      border:"none",
                      padding:
                        "8px 12px",
                      cursor:
                        "pointer"
                    }}
                  >
                    Reject
                  </button>

                </td>

              </tr>

            ))
          }

        </tbody>

      </table>

    </div>
  );
}