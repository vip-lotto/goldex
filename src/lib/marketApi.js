import marketData from "../data/marketData";

export async function getMarkets() {
  try {
    console.log("Fetching /api/markets");

    const res = await fetch("/api/markets");

    console.log("Status =", res.status);
    console.log("URL =", res.url);

    const text = await res.text();

    console.log("Response =", text);

    const json = JSON.parse(text);

    console.log("JSON =", json);

    const backendMarkets = json.data;

    return marketData.map((item) => {
      const api = backendMarkets.find(
        (m) => m.code === item.code
      );

      return {
        ...item,
        price: api?.price ?? 0,
        change: api?.change ?? 0,
      };
    });

  } catch (err) {
    console.error("MARKET ERROR:", err);
    return [];
  }
}