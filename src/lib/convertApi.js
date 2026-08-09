import { supabase } from "./supabase";
import { SITE_ID } from "../config/site";

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
.eq("member_id", userId)
.eq("site_id", SITE_ID);

  if (error) throw error;

  return data;
}