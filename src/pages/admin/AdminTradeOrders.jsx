import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {

    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setOrders(data || []);
    }

    setLoading(false);

  }

  async function deleteOrder(id) {

    if (!window.confirm("Delete this order ?")) return;

    await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    loadOrders();

  }

  return (

    <div className="admin-page">

      <h2>Trade Orders</h2>

      {loading ? (

        <p>Loading...</p>

      ) : (

        <table className="admin-table">

          <thead>

            <tr>

              <th>User</th>

              <th>Symbol</th>

              <th>Side</th>

              <th>Amount</th>

              <th>Open</th>

              <th>Close</th>

              <th>Profit</th>

              <th>Status</th>

              <th></th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order) => (

              <tr key={order.id}>

                <td>{order.user_id}</td>

                <td>{order.symbol}</td>

                <td>{order.side}</td>

                <td>${order.amount}</td>

                <td>{order.open_price}</td>

                <td>{order.close_price || "-"}</td>

                <td>${order.profit || 0}</td>

                <td>{order.status}</td>

                <td>

                  <button

                    onClick={() =>
                      deleteOrder(order.id)
                    }

                  >

                    Delete

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}