const axios = require("axios");

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

const STOCKS = [
  "AAPL",
  "TSLA",
  "NVDA",
  "META",
  "GOOGL",
  "NFLX",
  "AMD",
  "INTC",
  "UBER",
  "COIN",
];

async function getStock(symbol) {
  try {

    const { data } = await axios.get(
      "https://finnhub.io/api/v1/quote",
      {
        params: {
          symbol,
          token: FINNHUB_API_KEY,
        },
      }
    );

    return {
      code: symbol,
      price: Number(data.c || 0),
      change: Number(data.dp || 0),
      source: "finnhub",
    };

  } catch (err) {

    console.log(
      "Finnhub Error:",
      symbol,
      err.response?.data || err.message
    );

    return {
      code: symbol,
      price: 0,
      change: 0,
      source: "finnhub",
    };

  }
}

async function getStockMarkets() {

  const result = [];

  for (const symbol of STOCKS) {

    const stock = await getStock(symbol);

    result.push(stock);

  }

  return result;

}

module.exports = {

  getStockMarkets,

};