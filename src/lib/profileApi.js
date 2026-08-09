import { supabase } from "./supabase";
import { SITE_ID } from "../config/site";

export async function getProfile(userId) {

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .eq("site_id", SITE_ID)
    .single();

  if (error) throw error;

  return data;
}

export async function updateProfile(userId, values) {

  const { data, error } = await supabase
    .from("profiles")
    .update(values)
    .eq("id", userId)
    .eq("site_id", SITE_ID)
    .select()
    .single();

  if (error) throw error;

  return data;
}