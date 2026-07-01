import { getMarkets } from "./marketApi";

let timer = null;

/**
 * โหลดข้อมูลตลาดครั้งเดียว
 */
export async function loadMarkets(setMarkets) {
  try {
    const data = await getMarkets();
    setMarkets(data);
  } catch (err) {
    console.error("Load Markets Error:", err);
  }
}

/**
 * เริ่มอัปเดตราคาอัตโนมัติ
 * @param {Function} setMarkets
 * @param {number} interval
 */
export function startRealtimeMarkets(
  setMarkets,
  interval = 5000
) {
  stopRealtimeMarkets();

  // โหลดครั้งแรก
  loadMarkets(setMarkets);

  // โหลดซ้ำทุก interval
  timer = setInterval(() => {
    loadMarkets(setMarkets);
  }, interval);
}

/**
 * หยุดอัปเดตราคา
 */
export function stopRealtimeMarkets() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}