// src/lib/tradeResult.js

export function calculateTradeResult({

  side,

  openPrice,

  closePrice,

  amount,

  payout,

}) {

  let win = false;

  if (
    side === "buy" &&
    closePrice > openPrice
  ) {
    win = true;
  }

  if (
    side === "sell" &&
    closePrice < openPrice
  ) {
    win = true;
  }

  const profit =
    win
      ? Number(
          (
            amount *
            payout /
            100
          ).toFixed(2)
        )
      : 0;

  const total =
    win
      ? Number(
          (
            amount +
            profit
          ).toFixed(2)
        )
      : 0;

  return {

    result: win ? "win" : "lose",

    profit,

    total,

  };

}