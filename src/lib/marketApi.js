import marketData from "../data/marketData";

const API_URL = "/api/markets";

export async function getMarkets() {
  try {
    const res = await fetch(API_URL);

    const json = await res.json();

    console.log("API Response:", json);

    if (!json.success) {
      throw new Error("API Error");
    }

    const backendMarkets = json.data;

    console.log("backendMarkets:", backendMarkets);

    const result = marketData.map((item) => {
      const api = backendMarkets.find(
        (m) => m.code === item.code
      );

      if (!api) {
        return {
          ...item,
          price: 0,
          change: 0,
          status: "offline",
        };
      }

      return {
        ...item,
        price: api.price,
        change: api.change,
        status: "online",
      };
    });

    console.log("result:", result);

    return result;

  } catch (err) {
    console.error("MARKET ERROR:", err);
    return [];
  }
}