import marketData from "../data/marketData";

export async function getMarkets() {
  try {
    const url = window.location.origin + "/api/markets";

    console.log("URL =", url);

    const res = await fetch(url);

    console.log("Status =", res.status);

    const text = await res.text();

    console.log("TEXT =", text);

    const json = JSON.parse(text);

    const backendMarkets = json.data || [];

    return marketData.map(item => {
      const api = backendMarkets.find(m => m.code === item.code);

      return {
        ...item,
        price: api?.price ?? 0,
        change: api?.change ?? 0,
      };
    });

  } catch (err) {
    console.error(err);
    return [];
  }
}