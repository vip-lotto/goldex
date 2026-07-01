import marketData from "../data/marketData";

const API_URL = "http://localhost:3000/api/markets";

export async function getMarkets() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();

    if (!json.success) {
      throw new Error(json.message);
    }

    const apiData = json.data;

    console.log("API DATA");
    console.log(apiData);


    const markets = marketData.map((item) => {
      const market = apiData.find(
        (m) => m.code === item.code
      );

      if (!market) {
        return {
          ...item,
          price: 0,
          change: 0,
          status: "offline",
        };
      }

      return {
  ...item,
  price: Number(market.price ?? 0),
  change: Number(market.change ?? 0),
  source: market.source,
  status:
    market.price && Number(market.price) > 0
      ? "online"
      : "offline",
};
    });

    return markets;

  } catch (err) {

    console.error("Market API Error:", err);

    return marketData.map((item) => ({
      ...item,
      price: 0,
      change: 0,
      status: "offline",
    }));

  }
}