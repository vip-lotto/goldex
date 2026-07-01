// src/lib/tradeService.js

import { supabase } from "./supabase";

/**
 * เปิดออเดอร์
 */
export async function openTrade({
  userId,
  symbol,
  side,
  amount,
  duration,
  payout,
  openPrice,
}) {

  // ดึงยอดเงิน
  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .single();

  if (profileError) throw profileError;

  if (profile.balance < amount) {
    throw new Error("Insufficient balance");
  }

  // หักเงิน
  const { error: updateError } =
    await supabase
      .from("profiles")
      .update({
        balance: profile.balance - amount,
      })
      .eq("id", userId);

  if (updateError) throw updateError;

  // สร้างออเดอร์
  const { data, error } =
    await supabase
      .from("orders")
      .insert({
        user_id: userId,
        symbol,
        side,
        amount,
        duration,
        payout,
        open_price: openPrice,
        status: "running",
      })
      .select()
      .single();

  if (error) throw error;

  return data;
}

/**
 * ปิดออเดอร์
 */
export async function closeTrade({
  orderId,
  closePrice,
}) {

  const { data: order, error } =
    await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

  if (error) throw error;

  let result = "lose";

  if (
    order.side === "buy" &&
    closePrice > order.open_price
  ) {
    result = "win";
  }

  if (
    order.side === "sell" &&
    closePrice < order.open_price
  ) {
    result = "win";
  }

  let profit = 0;

  if (result === "win") {
    profit =
      order.amount *
      order.payout /
      100;
  }

  // ดึงยอดเงิน
  const { data: profile } =
    await supabase
      .from("profiles")
      .select("balance")
      .eq("id", order.user_id)
      .single();

  if (result === "win") {

    await supabase
      .from("profiles")
      .update({
        balance:
          profile.balance +
          order.amount +
          profit,
      })
      .eq("id", order.user_id);

  }

  await supabase
    .from("orders")
    .update({
      close_price: closePrice,
      result,
      profit,
      status: "closed",
      closed_at: new Date(),
    })
    .eq("id", order.id);

  return {
    result,
    profit,
  };
}

/**
 * รายการออเดอร์ของผู้ใช้
 */
export async function getOrders(userId) {

  const { data, error } =
    await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

  if (error) throw error;

  return data;

}

/**
 * ออเดอร์ที่กำลังรัน
 */
export async function getRunningOrders(userId) {

  const { data, error } =
    await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "running");

  if (error) throw error;

  return data;

}