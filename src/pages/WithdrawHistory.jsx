import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function WithdrawHistory() {

  const navigate = useNavigate();

  const [items, setItems] =
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

    const { data } =
      await supabase
        .from("withdrawals")
        .select("*")
        .eq(
          "user_id",
          user.id
        )
        .order(
          "created_at",
          {
            ascending:false
          }
        );

    setItems(data || []);

  };

  const getStatusColor =
    (status) => {

    if(status === "approved")
      return "#22c55e";

    if(status === "processing")
      return "#f59e0b";

    if(status === "rejected")
      return "#ef4444";

    return "#94a3b8";
  };

  const getStatusText =
    (status) => {

    if(status === "approved")
      return "สำเร็จ";

    if(status === "processing")
      return "กำลังตรวจสอบ";

    if(status === "rejected")
      return "ปฏิเสธ";

    return "รออนุมัติ";
  };

  return (

    <div
      style={{
        minHeight:"100vh",
        background:"#06152d",
        color:"#fff",
        padding:"20px"
      }}
    >

      <div
        style={{
          display:"flex",
          alignItems:"center",
          gap:"12px",
          marginBottom:"20px"
        }}
      >

        <button
          onClick={() =>
            navigate(-1)
          }
          style={{
            background:"#fff",
            border:"none",
            width:"42px",
            height:"42px",
            borderRadius:"12px",
            cursor:"pointer"
          }}
        >
          <ArrowLeft size={22}/>
        </button>

        <h2>
          Withdraw History
        </h2>

      </div>

      {
        items.length === 0 && (

          <div
            style={{
              textAlign:"center",
              marginTop:"80px",
              color:"#94a3b8"
            }}
          >
            ยังไม่มีประวัติถอนเงิน
          </div>

        )
      }

      {items.map((item) => (

        <div
          key={item.id}
          style={{
            background:"#10203d",
            padding:"18px",
            borderRadius:"15px",
            marginBottom:"15px"
          }}
        >

          <div
            style={{
              display:"flex",
              justifyContent:"space-between",
              marginBottom:"10px"
            }}
          >

            <b>
              {item.coin}
            </b>

            <span
              style={{
                color:getStatusColor(
                  item.status
                ),
                fontWeight:"bold"
              }}
            >
              {
                getStatusText(
                  item.status
                )
              }
            </span>

          </div>

          <p>
            Amount :
            {item.amount}
          </p>

          <p>
            Network :
            {item.network}
          </p>

          <p
            style={{
              wordBreak:"break-all"
            }}
          >
            Address :
            {item.address}
          </p>

          <p>
            Fee :
            {item.fee}
          </p>

          <p>
            Receive :
            {item.receive_amount}
          </p>

          <small
            style={{
              color:"#94a3b8"
            }}
          >
            {
              item.created_at
              ? new Date(
                  item.created_at
                ).toLocaleString()
              : "-"
            }
          </small>

        </div>

      ))}

    </div>

  );

}