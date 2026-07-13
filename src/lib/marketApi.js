import marketData from "../data/marketData";

const API_URL = "/api/markets";

export async function getMarkets() {

  try {

    const res = await fetch(API_URL);

    const json = await res.json();

    if (!json.success) {
      throw new Error("API Error");
    }

    const backendMarkets = json.data;

    return marketData.map((item) => {

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

  } catch (err) {

    console.error(err);

    return [];

  }

}