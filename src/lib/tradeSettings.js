import { supabase } from "./supabase";

/* โหลดการตั้งค่า */

export async function getTradeSettings() {

  const { data, error } = await supabase
    .from("trade_settings")
    .select("*")
    .eq("enabled", true)
    .order("duration", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];

}

/* โหลดทีละรายการ */

export async function getTradeSetting(id) {

  const { data, error } = await supabase
    .from("trade_settings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;

}

/* บันทึก */

export async function updateTradeSetting(setting) {

  const { error } = await supabase

    .from("trade_settings")

    .update({

      duration: setting.duration,

      payout: setting.payout,

      minimum: setting.minimum,

      enabled: setting.enabled,

    })

    .eq("id", setting.id);

  if (error) throw error;

}

/* realtime */

export function watchTradeSettings(callback) {

  const channel = supabase

    .channel("trade-settings")

    .on(

      "postgres_changes",

      {

        event: "*",

        schema: "public",

        table: "trade_settings",

      },

      async () => {

        const settings =

          await getTradeSettings();

        callback(settings);

      }

    )

    .subscribe();

  return () => {

    supabase.removeChannel(channel);

  };

}