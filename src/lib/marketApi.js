import marketData from "../data/marketData";

const API_URL = "https://goldtrust.web3-trustx.com/api/markets";

export async function getMarkets() {
  try {
    const res = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();

    const backendMarkets = json.data || [];

    return marketData.map((item) => {
      const api = backendMarkets.find(
        (m) => m.code === item.code
      );

      return {
        ...item,
        price: api?.price ?? 0,
        change: api?.change ?? 0,
        status: api ? "online" : "offline",
      };
    });

  } catch (err) {
    console.error("MARKET ERROR:", err);
    return [];
  }
}