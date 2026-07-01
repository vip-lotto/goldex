import { supabase } from "./supabase";

export async function createTrade(data) {
  const { data: result, error } = await supabase
    .from("trades")
    .insert([data])
    .select()
    .single();

  if (error) throw error;

  return result;
}

export async function updateTrade(id, values) {
  const { data, error } = await supabase
    .from("trades")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getTradeHistory(userId) {
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}