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

  let list = [];

  // =========================
  // Deposit
  // =========================

  (depositsRes.data || []).forEach(item => {

    list.push({

      id: `deposit-${item.id}`,

      type: "deposit",

      amount: item.amount,

      status: item.status,

      description: `ฝาก ${item.coin}`,

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

      amount: item.amount,

      status: item.status,

      description: `ถอน ${item.coin}`,

      created_at: item.created_at

    });

  });

  // =========================
  // Transfer
  // =========================

  (transfersRes.data || []).forEach(item => {

    list.push({

      id: `transfer-${item.id}`,

      type: "transfer",

      amount: item.amount,

      status: item.status,

      description: `โอน ${item.coin}`,

      created_at: item.created_at

    });

  });

  // =========================
  // Trade
  // =========================

  (tradesRes.data || []).forEach(item => {

  list.push({

    id: `trade-${item.id}`,

    type: "trade",

    amount:
      item.result === "win"
        ? item.payout
        : item.amount,

    status: item.status,

    result: item.result,

    description: `${item.side} ${item.coin}`,

    created_at: item.created_at

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