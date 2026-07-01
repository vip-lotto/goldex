import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function DepositHistory() {

  const [deposits, setDeposits] =
    useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (!user) return;

    const { data, error } =
      await supabase
        .from("deposits")
        .select("*")
        .eq("user_id", user.id)
        .order("id", {
          ascending: false
        });

    if (error) {
      console.log(error);
      return;
    }

    setDeposits(data || []);
  };

  return (

    <div
      style={{
        padding: "20px",
        color: "#fff",
        background: "#02133f",
        minHeight: "100vh"
      }}
    >

      <h2>
        ประวัติการฝากเงิน
      </h2>

      {deposits.length === 0 && (
        <p>
          ยังไม่มีประวัติฝากเงิน
        </p>
      )}

      {deposits.map((item) => (

        <div
          key={item.id}
          style={{
            background: "#0b2569",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "15px"
          }}
        >

          <p>
            เหรียญ :
            {" "}
            {item.coin}
          </p>

          <p>
            Network :
            {" "}
            {item.network}
          </p>

          <p>
            วันที่ :
            {" "}
            {
              new Date(
                item.created_at
              ).toLocaleString()
            }
          </p>

          <p>
            สถานะ :
            {" "}

            {item.status ===
              "pending" && (
              <span
                style={{
                  color:
                    "orange"
                }}
              >
                รออนุมัติ
              </span>
            )}

            {item.status ===
              "approved" && (
              <span
                style={{
                  color:
                    "lime"
                }}
              >
                อนุมัติแล้ว
              </span>
            )}

            {item.status ===
              "rejected" && (
              <span
                style={{
                  color:
                    "red"
                }}
              >
                ปฏิเสธ
              </span>
            )}

          </p>

          {item.slip_url && (

            <img
              src={item.slip_url}
              alt=""
              style={{
                width: "120px",
                borderRadius: "10px",
                marginTop: "10px"
              }}
            />

          )}

        </div>

      ))}

    </div>

  );
}