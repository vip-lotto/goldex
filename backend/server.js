require("dotenv").config();


const express = require("express");
const cors = require("cors");

const {
  getMarket,
  getAllMarkets,
} = require("./marketService");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

console.log(
  "FINNHUB:",
  process.env.FINNHUB_API_KEY
);

console.log(
  "GOLDAPI:",
  process.env.GOLDAPI_API_KEY
);

console.log(
  "TWELVEDATA:",
  process.env.TWELVEDATA_API_KEY
);


// ===============================
// Home
// ===============================

app.get("/", (req, res) => {
  res.send("🚀 GOLDEX Market API");
});

// ===============================
// Market By Symbol
// ===============================

app.get("/api/market/:symbol", async (req, res) => {
  try {
    const symbol =
      req.params.symbol.toUpperCase();

    const data =
      await getMarket(symbol);

    res.json({
      success: true,
      data,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

// ===============================
// All Markets
// ===============================

app.get("/api/markets", async (req, res) => {

  try {

    const data =
      await getAllMarkets();

    res.json({

      success: true,

      total: data.length,

      data,

      updatedAt: new Date(),

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

});

// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {

  console.log("====================================");
  console.log("🚀 GOLDEX Backend Started");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("====================================");

});