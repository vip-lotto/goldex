import { supabase } from "./supabase";

// โหลดประวัติถอน
export async function getWithdrawHistory(userId) {
  const { data, error } = await supabase
    .from("withdraw_requests")
    .select(`
      *,
      bank_accounts(
        bank_name,
        account_name,
        account_number
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

// ส่งคำขอถอน
export async function createWithdraw(values) {
  const { data, error } = await supabase
    .from("withdraw_requests")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// เปลี่ยนสถานะ
export async function updateWithdrawStatus(id, status) {
  const { data, error } = await supabase
    .from("withdraw_requests")
    .update({
      status,
      approved_at: new Date()
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// หักยอดเงินในกระเป๋า
export async function deductWallet(userId, amount) {
  const { data: wallet, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  if (Number(wallet.balance) < Number(amount)) {
    throw new Error("ยอดเงินไม่เพียงพอ");
  }

  const newBalance = Number(wallet.balance) - Number(amount);

  const { data, error: updateError } = await supabase
    .from("wallets")
    .update({
      balance: newBalance,
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (updateError) throw updateError;

  return data;
}

// คืนยอดเงิน (ใช้กรณีแอดมินปฏิเสธรายการถอน)
export async function refundWallet(userId, amount) {
  const { data: wallet, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  const { data, error: updateError } = await supabase
    .from("wallets")
    .update({
      balance: Number(wallet.balance) + Number(amount),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (updateError) throw updateError;

  return data;
}