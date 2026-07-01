import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function TransferHistory() {

  const navigate = useNavigate();

  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {

    const user =
      JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    const { data } =
      await supabase
        .from("transfers")
        .select("*")
        .or(
          `sender_id.eq.${user.id},receiver_id.eq.${user.id}`
        )
        .order("id", {
          ascending: false
        });

    setHistory(data || []);

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#111318",
        color: "#fff",
        padding: 20
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
          marginBottom: 25
        }}
      >

        <ArrowLeft
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />

        <h2
          style={{
            margin: 0
          }}
        >
          Transfer History
        </h2>

      </div>

      {

        history.length === 0 ?

        (

          <div
            style={{
              textAlign: "center",
              marginTop: 120,
              color: "#777"
            }}
          >

            No Transfer History

          </div>

        )

        :

        history.map((item) => (

          <div
            key={item.id}
            style={{
              background: "#1a1d23",
              borderRadius: 18,
              padding: 18,
              marginBottom: 15
            }}
          >

            <h3
              style={{
                margin: 0
              }}
            >
              {item.amount} {item.coin}
            </h3>

            <p
              style={{
                color: "#888",
                marginTop: 8
              }}
            >
              {item.network}
            </p>

            <p
              style={{
                color: "#18c964"
              }}
            >
              {item.status}
            </p>

          </div>

        ))

      }

    </div>

  );

}