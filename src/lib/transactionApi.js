import { supabase } from "./supabase";

// =========================
// รวมประวัติทั้งหมด
// =========================
export async function getTransactions(userId) {

  const [
    depositsRes,
    withdrawalsRes,
    transfersRes,
    tradesRes
  ] = await Promise.all([

    supabase
      .from("deposits")
      .select("*")
      .eq("user_id", userId),

    supabase
      .from("withdrawals")
      .select("*")
      .eq("user_id", userId),

    supabase
      .from("transfers")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`),

    supabase
      .from("trades")
      .select("*")
      .eq("user_id", userId)

  ]);

  console.log("USER ID:", userId);

console.log("Deposits:", depositsRes.data);
console.log("Withdrawals:", withdrawalsRes.data);
console.log("Transfers:", transfersRes.data);
console.log("Transfer Error:", transfersRes.error);
console.log("Trades:", tradesRes.data);

  let list = [];

 // =========================
// Deposit
// =========================

(depositsRes.data || []).forEach(item => {

  list.push({

  id: `deposit-${item.id}`,

  type: "deposit",

  coin: item.coin,
  network: item.network,

  amount: item.amount,

  status: item.status,

  description: `Deposit ${item.coin}`,

  created_at: item.created_at

});

});

  // =========================
  // Withdraw
  // =========================

  (withdrawalsRes.data || []).forEach(item => {

    list.push({

  id: `withdraw-${item.id}`,

  type: "withdraw",

  coin: item.coin,
  network: item.network,

  amount: item.amount,

  status: item.status,

  description: `Withdraw ${item.coin}`,

  created_at: item.created_at

});

  });

  // =========================
// Transfer
// =========================

(transfersRes.data || []).forEach(item => {

  list.push({

    id:`transfer-${item.id}`,

    type:"transfer",

    coin:item.coin,
    network:item.network,

    amount:item.amount,

    status:item.status,

    sender_id:item.sender_id,

    receiver_id:item.receiver_id,

    direction:
      Number(item.sender_id)===Number(userId)
      ? "send"
      : "receive",

    description:
      Number(item.sender_id)===Number(userId)
      ? `Send ${item.coin}`
      : `Receive ${item.coin}`,

    created_at:item.created_at

});

});

  // =========================
  // Trade
  // =========================

  (tradesRes.data || []).forEach(item => {

  list.push({

    id:`trade-${item.id}`,

    type:"trade",

    coin:item.coin,

    symbol:item.coin,

    side:item.side,

    result:item.result,

    amount:
      item.result==="win"
      ? item.payout
      : item.amount,

    status:item.status,

    description:`${item.side} ${item.coin}`,

    created_at:item.created_at

});

});
  // เรียงจากใหม่ไปเก่า
  list.sort((a, b) =>
    new Date(b.created_at) - new Date(a.created_at)
  );

  return list;

}

// =========================
// เพิ่มรายการลง transactions
// (ใช้ได้กรณีต้องการเก็บ Log เพิ่ม)
// =========================

export async function addTransaction(values) {

  const { data, error } = await supabase
    .from("transactions")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data;

}