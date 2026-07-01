const axios = require("axios");
const yahooFinance = require("yahoo-finance2").default;

const yahooMap = {
  XAUUSD: "GC=F",
  XAGUSD: "SI=F",

  EURUSD: "EURUSD=X",
  GBPUSD: "GBPUSD=X",
  USDJPY: "JPY=X",

  AAPL: "AAPL",
  TSLA: "TSLA",
  AMZN: "AMZN",
  NVDA: "NVDA",

  SPX500: "^GSPC",
  NAS100: "^NDX",
};

// =========================
// Crypto (Binance)
// =========================

async function getCrypto(symbol) {
  const [priceRes, statRes] = await Promise.all([
    axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    ),
    axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
    ),
  ]);

  return {
    code: symbol,
    price: Number(priceRes.data.price),
    change: Number(statRes.data.priceChangePercent),
    source: "binance",
  };
}

// =========================
// Yahoo
// =========================

async function getYahoo(symbol) {
  const yahooSymbol = yahooMap[symbol];

  if (!yahooSymbol) {
    return {
      code: symbol,
      price: 0,
      change: 0,
      source: "yahoo",
    };
  }

  try {
    const quote = await yahooFinance.quote(yahooSymbol);

    return {
      code: symbol,
      price: Number(quote.regularMarketPrice || 0),
      change: Number(
        quote.regularMarketChangePercent || 0
      ),
      source: "yahoo",
    };
  } catch (err) {
    console.log("Yahoo Error:", symbol);

    return {
      code: symbol,
      price: 0,
      change: 0,
      source: "yahoo",
    };
  }
}

// =========================
// Market
// =========================

async function getMarket(symbol) {
  if (symbol.endsWith("USDT")) {
    return getCrypto(symbol);
  }

  return getYahoo(symbol);
}

async function getAllMarkets() {
  const result = [];

  const crypto = [
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "SOLUSDT",
    "DOGEUSDT",
    "ADAUSDT",
    "XRPUSDT",
    "SUIUSDT",
  ];

  for (const symbol of crypto) {
    result.push(await getCrypto(symbol));
  }

  for (const symbol of Object.keys(yahooMap)) {
    result.push(await getYahoo(symbol));
  }

  return result;
}

module.exports = {
  getMarket,
  getAllMarkets,
};