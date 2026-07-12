const axios = require("axios");

// ===============================
// Crypto Symbols
// ===============================

const CRYPTO = [

  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "SUIUSDT",
  "DOGEUSDT",
  "ADAUSDT",
  "XRPUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "TONUSDT",
  "TRXUSDT",
  "LTCUSDT",
  "BCHUSDT",
  "DOTUSDT",
  "ARBUSDT",
  "MATICUSDT",
  "OPUSDT",
  "ATOMUSDT",
  "NEARUSDT",
  "FILUSDT",
  "APTUSDT",
  "PEPEUSDT",
  "SHIBUSDT",
  "UNIUSDT",

];

// ===============================
// Get One Crypto
// ===============================

async function getCrypto(symbol){

  try{

    const [price, stat] = await Promise.all([

      axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
      ),

      axios.get(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
      ),

    ]);

    return{

      code: symbol,

      price: Number(price.data.price),

      change: Number(stat.data.priceChangePercent),

      source:"binance"

    };

  }catch(err){

    console.log(
      "Crypto Error:",
      symbol
    );

    return{

      code:symbol,

      price:0,

      change:0,

      source:"binance"

    };

  }

}

// ===============================
// Get All Crypto
// ===============================

async function getCryptoMarkets(){

  return await Promise.all(

    CRYPTO.map(symbol=>getCrypto(symbol))

  );

}

module.exports={

  getCryptoMarkets,

};