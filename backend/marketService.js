const { getCryptoMarkets } = require("./cryptoService");
const { getStockMarkets } = require("./stockService");
const { getMetalMarkets } = require("./metalService");

// =========================================
// Get Market By Symbol
// =========================================

async function getMarket(symbol) {

  const [crypto, stocks, metals] = await Promise.all([
    getCryptoMarkets(),
    getStockMarkets(),
    getMetalMarkets(),
  ]);

  const markets = [
    ...metals,
    ...crypto,
    ...stocks,
  ];

  return (
    markets.find((item) => item.code === symbol) || {
      code: symbol,
      price: 0,
      change: 0,
      source: "unknown",
    }
  );
}

// =========================================
// Get All Markets
// =========================================

async function getAllMarkets() {

  const [crypto, stocks, metals] = await Promise.all([
    getCryptoMarkets(),
    getStockMarkets(),
    getMetalMarkets(),
  ]);

  return [
    ...metals,
    ...crypto,
    ...stocks,
  ];
}

// =========================================
// Exports
// =========================================

module.exports = {
  getMarket,
  getAllMarkets,
};