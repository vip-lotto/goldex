import { supabase } from "./supabase";

export async function createTransfer(data) {
  const { data: result, error } = await supabase
    .from("transfers")
    .insert([data])
    .select()
    .single();

  if (error) throw error;

  return result;
}

export async function getTransfers(userId) {
  const { data, error } = await supabase
    .from("transfers")
    .or(`from_user.eq.${userId},to_user.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}