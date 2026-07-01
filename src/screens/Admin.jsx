import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const [tradeMode, setTradeMode] = useState("auto");
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    loadSetting();
    loadTrades();

    const timer = setInterval(() => {
      loadTrades();
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  async function loadSetting() {
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "tradeMode")
      .single();

    if (data) {
      setTradeMode(data.value);
    }

    setLoading(false);
  }

  async function loadTrades() {
    const { data } = await supabase
      .from("trades")
      .select("*")
      .eq("status", "trading")
      .order("id", { ascending: false });

    setTrades(data || []);
  }

  async function save() {
    await supabase
      .from("settings")
      .update({
        value: tradeMode,
      })
      .eq("key", "tradeMode");

    alert("บันทึกเรียบร้อย");
  }

  if (loading) {
    return (
      <div style={container}>
        Loading...
      </div>
    );
  }

  return (
    <div style={container}>

      <h1>Admin Dashboard</h1>

      <h3>Trade Result Mode</h3>

      <label style={label}>
        <input
          type="radio"
          value="auto"
          checked={tradeMode === "auto"}
          onChange={(e) => setTradeMode(e.target.value)}
        />
        Auto
      </label>

      <label style={label}>
        <input
          type="radio"
          value="lock_win"
          checked={tradeMode === "lock_win"}
          onChange={(e) => setTradeMode(e.target.value)}
        />
        Lock Win
      </label>

      <label style={label}>
        <input
          type="radio"
          value="lock_lose"
          checked={tradeMode === "lock_lose"}
          onChange={(e) => setTradeMode(e.target.value)}
        />
        Lock Lose
      </label>

      <button style={button} onClick={save}>
        Save
      </button>

      <hr style={{ margin: "35px 0" }} />

      <h2>
        🟢 กำลังเทรด ({trades.length})
      </h2>

      {trades.length === 0 ? (

        <div style={{ marginTop: 20 }}>
          ไม่มีผู้กำลังเทรด
        </div>

      ) : (

        <table style={table}>
          <thead>

            <tr>

              <th style={th}>ID</th>
              <th style={th}>User</th>
              <th style={th}>Market</th>
              <th style={th}>Side</th>
              <th style={th}>Amount</th>
              <th style={th}>Duration</th>
              <th style={th}>Status</th>

            </tr>

          </thead>

          <tbody>

            {trades.map((t) => (

              <tr key={t.id}>

                <td style={td}>{t.id}</td>

                <td style={td}>{t.user_id}</td>

                <td style={td}>{t.coin}</td>

                <td
                  style={{
                    ...td,
                    color:
                      t.side === "BUY"
                        ? "#00ff66"
                        : "#ff4d4f",
                    fontWeight: "bold",
                  }}
                >
                  {t.side}
                </td>

                <td style={td}>
                  $
                  {Number(
                    t.amount
                  ).toLocaleString()}
                </td>

                <td style={td}>
                  {t.duration} นาที
                </td>

                <td
                  style={{
                    ...td,
                    color: "#FFD54F",
                    fontWeight: "bold",
                  }}
                >
                  {t.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}

const container = {
  background: "#111",
  color: "#fff",
  minHeight: "100vh",
  padding: 30,
};

const label = {
  display: "block",
  marginTop: 12,
  fontSize: 18,
};

const button = {
  marginTop: 25,
  padding: "12px 30px",
  border: 0,
  borderRadius: 8,
  background: "#f5a623",
  color: "#000",
  fontWeight: "bold",
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 25,
};

const th = {
  padding: 12,
  borderBottom: "1px solid #333",
  textAlign: "left",
};

const td = {
  padding: 12,
  borderBottom: "1px solid #222",
};