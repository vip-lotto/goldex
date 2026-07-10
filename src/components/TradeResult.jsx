import "../styles/tradeResult.css";

export default function TradeResult({
  receipt,
  onClose,
}) {
  if (!receipt) return null;

  const isWin = receipt.result === "win";

  const investment = Number(receipt.investment || 0);
  const profit = Number(receipt.profit || 0);
  const loss = Number(receipt.loss || investment);
  const payout = Number(receipt.payout || 0);

  return (
    <div className="trade-result-overlay">

      <div className="trade-result-card">

        <div className="result-circle">
        i
        </div>

        <div className="result-title">
        Transaction Details
        </div>

        <div className={`result-money ${isWin ? "win" : "lose"}`}>

          {isWin
            ? `+${profit.toLocaleString()}`
            : `-${loss.toLocaleString()}`}

          <span> USDT</span>

        </div>

        <div className="result-message">

          Transaction Completed

        </div>

        <div className="result-table">

          <div className="result-row">
            <span>Market</span>
            <strong>{receipt.market}</strong>
          </div>

          <div className="result-row">
            <span>Direction</span>

            <strong
              className={
                receipt.side === "BUY"
                  ? "green"
                  : "red"
              }
            >
              {receipt.side}
            </strong>

          </div>

          <div className="result-row">
            <span>Investment</span>
            <strong>{investment.toLocaleString()} USDT</strong>
          </div>

          <div className="result-row">
            <span>Profit / Loss</span>

            <strong
              className={
                isWin
                  ? "green"
                  : "red"
              }
            >
              {isWin
                ? `+${profit.toLocaleString()}`
                : `-${loss.toLocaleString()}`}
            </strong>

          </div>

          <div className="result-row">
            <span>Payout</span>

            <strong className="blue">
              {payout.toLocaleString()} USDT
            </strong>

          </div>

          <div className="result-row">
            <span>Duration</span>
            <strong>{receipt.duration}s</strong>
          </div>

          <div className="result-row">
            <span>Open Time</span>

            <strong>
              {receipt.openTime
                ? new Date(receipt.openTime).toLocaleString()
                : "-"}
            </strong>

          </div>

          <div className="result-row">
            <span>Close Time</span>

            <strong>
              {receipt.closeTime
                ? new Date(receipt.closeTime).toLocaleString()
                : "-"}
            </strong>

          </div>

          <div className="result-row">
            <span>Orders</span>

            <strong>
              #{receipt.id}
            </strong>

          </div>

        </div>

        <button
          className="result-button"
          onClick={onClose}
        >
          CONFIRM
        </button>

      </div>

    </div>
  );
}