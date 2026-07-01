export async function getCryptoPrice(symbol) {

  try {

    const res = await fetch(
      `http://localhost:3000/api/market/${encodeURIComponent(symbol)}`
    );

    if (!res.ok) {

      const err = await res.json();

      console.error("API Error:", err);

      return {
        price: 0,
        change: 0,
      };

    }

    return await res.json();

  } catch (err) {

    console.error("Fetch Error:", err);

    return {
      price: 0,
      change: 0,
    };

  }

}