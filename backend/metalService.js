const axios = require("axios");

const GOLDAPI_API_KEY = process.env.GOLDAPI_API_KEY;

const METALS = [
  {
    code: "XAUUSD",
    api: "XAU",
  },
  {
    code: "XAGUSD",
    api: "XAG",
  },
  {
    code: "XPDUSD",
    api: "XPD",
  },
];

async function getMetal(item) {

  try {

    const { data } = await axios.get(

      `https://www.goldapi.io/api/${item.api}/USD`,

      {

        headers: {

          "x-access-token": GOLDAPI_API_KEY,

          "Content-Type": "application/json",

        },

      }

    );

    return {

      code: item.code,

      price: Number(data.price || 0),

      change: Number(data.chp || 0),

      source: "goldapi",

    };

  } catch (err) {

    console.log(

      "GoldAPI Error:",

      item.code,

      err.response?.data || err.message

    );

    return {

      code: item.code,

      price: 0,

      change: 0,

      source: "goldapi",

    };

  }

}

async function getMetalMarkets() {

  const result = [];

  for (const item of METALS) {

    result.push(

      await getMetal(item)

    );

  }

  return result;

}

module.exports = {

  getMetalMarkets,

};