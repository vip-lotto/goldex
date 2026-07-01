import { supabase } from "./supabase";

export async function createNotification(data) {
  const { error } = await supabase
    .from("notifications")
    .insert([data]);

  if (error) throw error;
}

export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}