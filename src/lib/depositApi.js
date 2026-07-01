import { supabase } from "./supabase";

export async function createDeposit(data) {
  const { data: result, error } = await supabase
    .from("deposits")
    .insert([data])
    .select()
    .single();

  if (error) throw error;

  return result;
}

export async function getDeposits(userId) {
  const { data, error } = await supabase
    .from("deposits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}