import { supabase } from "./supabase";

/*
  ติดตามออเดอร์ของผู้ใช้แบบ Realtime
*/

export function watchOrders(userId, callback) {

  const channel = supabase
    .channel("orders-" + userId)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
        filter: `user_id=eq.${userId}`,
      },
      async () => {

        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", {
            ascending: false,
          });

        callback(data || []);

      }
    )
    .subscribe();

  return () => {

    supabase.removeChannel(channel);

  };

}

/*
  ติดตามกระเป๋าเงิน
*/

export function watchWallet(userId, callback) {

  const channel = supabase
    .channel("wallet-" + userId)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "profiles",
        filter: `id=eq.${userId}`,
      },
      payload => {

        callback(payload.new);

      }
    )
    .subscribe();

  return () => {

    supabase.removeChannel(channel);

  };

}

/*
  โหลดออเดอร์
*/

export async function loadOrders(userId) {

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];

}

/*
  โหลด Position
*/

export async function loadRunning(userId) {

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "running");

  if (error) throw error;

  return data || [];

}