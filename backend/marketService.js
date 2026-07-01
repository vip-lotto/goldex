const axios = require("axios");

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const GOLDAPI_API_KEY = process.env.GOLDAPI_API_KEY;

// =========================================
// Binance (Crypto)
// =========================================

async function getCrypto(symbol) {
  const [price, stat] = await Promise.all([
    axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    ),
    axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
    ),
  ]);

  return {
    code: symbol,
    price: Number(price.data.price),
    change: Number(stat.data.priceChangePercent),
    source: "binance",
  };
}

// =========================================
// GoldAPI
// =========================================

async function getGold() {
  try {
    const { data } = await axios.get(
      "https://www.goldapi.io/api/XAU/USD",
      {
        headers: {
          "x-access-token": GOLDAPI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      code: "XAUUSD",
      price: Number(data.price || 0),
      change: Number(data.chp || 0),
      source: "goldapi",
    };
  } catch (err) {
    console.log("GoldAPI Error:");
    console.log(err.response?.data || err.message);

    return {
      code: "XAUUSD",
      price: 0,
      change: 0,
      source: "goldapi",
    };
  }
}

// =========================================
// Finnhub
// =========================================

async function getFinnhub(symbol) {
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
    console.log("Finnhub Error:", err.message);

    return {
      code: symbol,
      price: 0,
      change: 0,
      source: "finnhub",
    };
  }
}

// =========================================
// Get Single Market
// =========================================

async function getMarket(symbol) {

  if (symbol === "XAUUSD") {
    return await getGold();
  }

  if (symbol.endsWith("USDT")) {
    return await getCrypto(symbol);
  }

  return await getFinnhub(symbol);
}

// =========================================
// Get All Markets
// =========================================

async function getAllMarkets() {

  const symbols = [

    "XAUUSD",

    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "SOLUSDT",
    "DOGEUSDT",
    "ADAUSDT",
    "XRPUSDT",
    "SUIUSDT",
    "AVAXUSDT",
    "LINKUSDT",
    "TONUSDT",
    "TRXUSDT",
    "LTCUSDT",
    "BCHUSDT",
    "DOTUSDT",

    "AAPL",
    "TSLA",
    "NVDA",
    "AMZN",
  ];

  return await Promise.all(
    symbols.map((symbol) => getMarket(symbol))
  );
}

module.exports = {
  getCrypto,
  getGold,
  getFinnhub,
  getMarket,
  getAllMarkets,
};