// src/pages/admin/AdminTrades.jsx

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminTrades() {
  const [settings, setSettings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    loadOrders();
  }, []);

  async function loadSettings() {
    const { data } = await supabase
      .from("trade_settings")
      .select("*")
      .order("duration", { ascending: false });

    setSettings(data || []);
  }

  async function loadOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders(data || []);
    setLoading(false);
  }

  async function saveSetting(item) {
    await supabase
      .from("trade_settings")
      .update({
        payout: item.payout,
        minimum: item.minimum,
        enabled: item.enabled,
      })
      .eq("id", item.id);

    alert("Saved");
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-page">

      <h2>Trade Settings</h2>

      <table>
        <thead>
          <tr>
            <th>Minutes</th>
            <th>Payout %</th>
            <th>Minimum</th>
            <th>Enabled</th>
            <th></th>
          </tr>
        </thead>

        <tbody>

          {settings.map((item) => (

            <tr key={item.id}>

              <td>{item.duration}</td>

              <td>
                <input
                  type="number"
                  value={item.payout}
                  onChange={(e) => {
                    item.payout = Number(e.target.value);
                    setSettings([...settings]);
                  }}
                />
              </td>

              <td>
                <input
                  type="number"
                  value={item.minimum}
                  onChange={(e) => {
                    item.minimum = Number(e.target.value);
                    setSettings([...settings]);
                  }}
                />
              </td>

              <td>
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={(e) => {
                    item.enabled = e.target.checked;
                    setSettings([...settings]);
                  }}
                />
              </td>

              <td>
                <button
                  onClick={() => saveSetting(item)}
                >
                  Save
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <h2 style={{ marginTop: 40 }}>
        Orders
      </h2>

      <table>

        <thead>

          <tr>

            <th>User</th>

            <th>Symbol</th>

            <th>Side</th>

            <th>Amount</th>

            <th>Status</th>

            <th>Result</th>

            <th>Profit</th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr key={order.id}>

              <td>{order.user_id}</td>

              <td>{order.symbol}</td>

              <td>{order.side}</td>

              <td>${order.amount}</td>

              <td>{order.status}</td>

              <td>{order.result || "-"}</td>

              <td>${order.profit || 0}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}