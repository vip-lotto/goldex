import { supabase } from "./supabase";

export async function getExchangeRates() {

  const { data, error } = await supabase
    .from("exchange_rates")
    .select("*")
    .eq("is_active", true)
    .order("symbol");

  if (error) throw error;

  return data;
}

export async function getUserAssets(userId) {

  const { data, error } = await supabase
    .from("user_assets")
    .select("*")
    .eq("member_id", userId);

  if (error) throw error;

  return data;
}