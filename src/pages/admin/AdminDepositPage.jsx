import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminDeposit() {

  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDeposits();
  }, []);

  const loadDeposits = async () => {

    setLoading(true);

    const { data, error } = await supabase
      .from("deposits")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setDeposits(data || []);
    setLoading(false);
  };

  const approveDeposit = async (deposit) => {

    if (deposit.status !== "pending") {
      alert("รายการนี้ดำเนินการแล้ว");
      return;
    }

    const { data: wallet, error: walletLoadError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", deposit.user_id)
      .single();

    if (walletLoadError || !wallet) {
      alert("ไม่พบ Wallet");
      return;
    }

    const coin = deposit.coin.toUpperCase();

    if (!(coin in wallet)) {
      alert(`ไม่พบคอลัมน์ ${coin} ใน Wallet`);
      return;
    }

    const currentCoin = Number(wallet[coin] || 0);
    const currentBalance = Number(wallet.balance || 0);

    const { error: walletError } = await supabase
      .from("wallets")
      .update({
        [coin]: currentCoin + Number(deposit.amount),
        balance: currentBalance + Number(deposit.amount)
      })
      .eq("user_id", deposit.user_id);

    if (walletError) {
      alert(walletError.message);
      return;
    }

    const { error: depositError } = await supabase
      .from("deposits")
      .update({
        status: "approved"
      })
      .eq("id", deposit.id);

    if (depositError) {
      alert(depositError.message);
      return;
    }

    const { error: notifyError } = 
    
    await supabase
  .from("notifications")
  .insert({
    user_id: deposit.user_id,

    title_key: "depositSuccess",

    message_key: "depositApproved",

    coin: deposit.coin,

    network: deposit.network,

    amount: Number(deposit.amount),

    status: "success",

    type: "deposit",

    is_read: false
  });

    if (notifyError) {
      console.log(notifyError);
    }

    alert("อนุมัติสำเร็จ");
    loadDeposits();
  };

  const rejectDeposit = async (deposit) => {

    if (deposit.status !== "pending") {
      alert("รายการนี้ดำเนินการแล้ว");
      return;
    }

    const { error } = await supabase
      .from("deposits")
      .update({
        status: "rejected"
      })
      .eq("id", deposit.id);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase
  .from("notifications")
  .insert({
    user_id: deposit.user_id,

    title_key: "depositFailed",

    message_key: "depositRejected",

    coin: deposit.coin,

    network: deposit.network,

    amount: Number(deposit.amount),

    status: "failed",

    type: "deposit",

    is_read: false
  });

    alert("ปฏิเสธแล้ว");
    loadDeposits();
  };

  return (
  <div
    style={{
      padding: "20px",
      background: "#020f2d",
      color: "#fff",
      minHeight: "100vh"
    }}
  >
    <h2
      style={{
        color: "#facc15",
        marginBottom: "20px"
      }}
    >
      Deposit Management
    </h2>

    {loading ? (
      <p>Loading...</p>
    ) : (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >
        <thead>
          <tr
            style={{
              background: "#0b1739"
            }}
          >
            <th>ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Coin</th>
            <th>Network</th>
            <th>Slip</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {deposits.map((item) => (
            <tr
              key={item.id}
              style={{
                borderBottom: "1px solid #1f2f58"
              }}
            >
              <td>{item.id}</td>

              <td>{item.user_id}</td>

              <td>{item.amount}</td>

              <td>{item.coin}</td>

              <td>{item.network}</td>

              <td>
                {item.slip_url ? (
                  <a
                    href={item.slip_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#38bdf8",
                      textDecoration: "none"
                    }}
                  >
                    View
                  </a>
                ) : (
                  "-"
                )}
              </td>

              <td>
                <span
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    color: "#fff",
                    fontWeight: "bold",
                    background:
                      item.status === "approved"
                        ? "#16a34a"
                        : item.status === "pending"
                        ? "#f59e0b"
                        : "#dc2626"
                  }}
                >
                  {item.status}
                </span>
              </td>

              <td>
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "-"}
              </td>

              <td>
                <button
                  disabled={item.status !== "pending"}
                  onClick={() => approveDeposit(item)}
                  style={{
                    background: "#16a34a",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    marginRight: "8px",
                    cursor: "pointer",
                    opacity: item.status !== "pending" ? 0.5 : 1
                  }}
                >
                  Approve
                </button>

                <button
                  disabled={item.status !== "pending"}
                  onClick={() => rejectDeposit(item)}
                  style={{
                    background: "#dc2626",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    opacity: item.status !== "pending" ? 0.5 : 1
                  }}
                >
                  Reject
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