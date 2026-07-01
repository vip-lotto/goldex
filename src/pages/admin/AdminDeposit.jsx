import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminDeposit() {

  const [deposits, setDeposits] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadDeposits();
  }, []);

  const loadDeposits = async () => {

    setLoading(true);

    const { data, error } =
      await supabase
        .from("deposits")
        .select("*")
        .order("id", {
          ascending: false
        });

    if (!error) {
      setDeposits(data || []);
    }

    setLoading(false);
  };

  const approveDeposit =
    async (item) => {

      const amount =
        prompt(
          "กรอกจำนวนเงินที่ต้องการเติม"
        );

      if (!amount) return;

      const depositAmount =
        Number(amount);

      if (
        isNaN(depositAmount)
      ) {
        alert(
          "จำนวนเงินไม่ถูกต้อง"
        );
        return;
      }

      // ดึงข้อมูลผู้ใช้

      const {
        data: profile,
        error: profileError
      } =
        await supabase
          .from("profiles")
          .select("*")
          .eq(
            "id",
            item.user_id
          )
          .single();

      if (
        profileError ||
        !profile
      ) {

        alert(
          "ไม่พบข้อมูลผู้ใช้"
        );

        return;
      }

      // เพิ่มเงินเข้า wallets ด้วย

const {
  data: wallet
} =
  await supabase
    .from("wallets")
    .select("*")
    .eq(
      "user_id",
      item.user_id
    )
    .single();

if (wallet) {

  const walletBalance =
    Number(
      wallet.balance || 0
    );

  await supabase
    .from("wallets")
    .update({
      balance:
        walletBalance +
        depositAmount
    })
    .eq(
      "user_id",
      item.user_id
    );

}

      const currentBalance =
        Number(
          profile.balance || 0
        );

      const newBalance =
        currentBalance +
        depositAmount;

      // เพิ่มเงิน

      const {
        error: balanceError
      } =
        await supabase
          .from("profiles")
          .update({
            balance:
              newBalance
          })
          .eq(
            "id",
            item.user_id
          );

      if (balanceError) {

        alert(
          JSON.stringify(
            balanceError
          )
        );

        return;
      }

      // อัพเดทฝากเงิน

      const {
        error: depositError
      } =
        await supabase
          .from("deposits")
          .update({
            status:
              "approved",
            amount:
              depositAmount
          })
          .eq(
            "id",
            item.id
          );

      if (depositError) {

        alert(
          JSON.stringify(
            depositError
          )
        );

        return;
      }

      // แจ้งเตือน

      await supabase
        .from(
          "notifications"
        )
        .insert([
          {
            user_id:
              item.user_id,

            title:
              "ฝากเงินสำเร็จ",

            message:
              `เหรียญ : ${item.coin}
Network : ${item.network}
จำนวนเงิน : ${depositAmount.toLocaleString()}
สำเร็จ`
          }
        ]);

      alert(
        "อนุมัติสำเร็จ"
      );

      loadDeposits();
    };

  const rejectDeposit =
    async (item) => {

      await supabase
        .from("deposits")
        .update({
          status:
            "rejected"
        })
        .eq(
          "id",
          item.id
        );

      await supabase
        .from(
          "notifications"
        )
        .insert([
          {
            user_id:
              item.user_id,

            title:
              "ฝากเงินไม่สำเร็จ",

            message:
              `เหรียญ : ${item.coin}
Network : ${item.network}
ไม่สำเร็จ`
          }
        ]);

      alert(
        "ปฏิเสธสำเร็จ"
      );

      loadDeposits();
    };

  return (

    <div
      style={{
        padding: "20px",
        color: "#fff",
        background:
          "#02133b",
        minHeight:
          "100vh"
      }}
    >

      <h2>
        จัดการคำขอฝากเงิน
      </h2>

      {loading && (
        <h3>
          กำลังโหลด...
        </h3>
      )}

      {!loading &&
        deposits.length ===
          0 && (
          <h3>
            ไม่พบข้อมูลฝากเงิน
          </h3>
        )}

      <table
        style={{
          width: "100%"
        }}
      >

        <thead>

          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Coin</th>
            <th>Network</th>
            <th>Amount</th>
            <th>Slip</th>
            <th>Status</th>
            <th>จัดการ</th>
          </tr>

        </thead>

        <tbody>

          {deposits.map(
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
                {item.coin}
              </td>

              <td>
                {item.network}
              </td>

              <td>
                {item.amount ||
                  "-"}
              </td>

              <td>

                {item.slip_url ? (

                  <a
                    href={
                      item.slip_url
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color:
                        "yellow"
                    }}
                  >
                    ดูสลิป
                  </a>

                ) : (
                  "ไม่มีสลิป"
                )}

              </td>

              <td>
                {item.status}
              </td>

              <td>

                {item.status ===
                  "pending" && (

                  <>

                    <button
                      onClick={() =>
                        approveDeposit(
                          item
                        )
                      }
                    >
                      อนุมัติ
                    </button>

                    <button
                      style={{
                        marginLeft:
                          "10px"
                      }}
                      onClick={() =>
                        rejectDeposit(
                          item
                        )
                      }
                    >
                      ปฏิเสธ
                    </button>

                  </>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}