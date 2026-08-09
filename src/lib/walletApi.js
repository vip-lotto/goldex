import { supabase } from "./supabase";
import { SITE_ID } from "../config/site";

export async function getWallet(userId) {
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
.eq("site_id", SITE_ID)
.single();

  if (error) throw error;

  return data;
}

export async function updateWallet(userId, balance) {
  const { data, error } = await supabase
    .from("wallets")
    .update({ balance })
.eq("user_id", userId)
.eq("site_id", SITE_ID)
    .select()
    .single();

  if (error) throw error;

  return data;
}