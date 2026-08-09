import { supabase } from "./supabase";
import { SITE_ID } from "../config/site";

export async function createNotification(data) {

  const { error } = await supabase
    .from("notifications")
    .insert([
      {
        ...data,
        site_id: SITE_ID
      }
    ]);

  if (error) throw error;
}

export async function getNotifications(userId) {

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("site_id", SITE_ID)
    .order("created_at", {
      ascending: false
    });

  if (error) throw error;

  return data;
}