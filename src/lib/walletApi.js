import { supabase } from "./supabase";

export async function getWallet(userId) {
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  return data;
}

export async function updateWallet(userId, balance) {
  const { data, error } = await supabase
    .from("wallets")
    .update({ balance })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}