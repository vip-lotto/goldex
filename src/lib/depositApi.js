import { supabase } from "./supabase";
import { SITE_ID } from "../config/site";

export async function createDeposit(data) {

  const { data: result, error } = await supabase
    .from("deposits")
    .insert([
      {
        ...data,
        site_id: SITE_ID
      }
    ])
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
    .eq("site_id", SITE_ID)
    .order("created_at", {
      ascending: false
    });

  if (error) throw error;

  return data;
}