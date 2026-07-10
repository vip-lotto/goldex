import "../styles/tradePopup.css";

export default function TradePopup({
  trade,
  seconds,
  side,
  amount,
}) {
  if (!trade) return null;

  const total = Number(trade.duration || 30);

  const radius = 72;

  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (seconds / total) * circumference;

  const min = String(
    Math.floor(seconds / 60)
  ).padStart(2, "0");

  const sec = String(
    seconds % 60
  ).padStart(2, "0");

  return (
    <div className="trade-popup-overlay">

      <div className="trade-popup">

        <div className="popup-header">

          <div>

            <div className="popup-market">
              {trade.coin}
            </div>

            <div className="popup-subtitle">
              Trading Position
            </div>

          </div>

          <div
            className={
              side === "BUY"
                ? "popup-status buy"
                : "popup-status sell"
            }
          >
            {side}
          </div>

        </div>

        <div className="popup-circle">

          <svg viewBox="0 0 180 180">

            <circle
              className="circle-bg"
              cx="90"
              cy="90"
              r={radius}
            />

            <circle
              className="circle-progress"
              cx="90"
              cy="90"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />

          </svg>

          <div className="popup-time">

            <strong>

              {min}:{sec}

            </strong>

            <small>

              Remaining

            </small>

          </div>

        </div>

        <div className="popup-table">

          <div className="popup-row">
            <span>Market</span>
            <span>{trade.coin}</span>
          </div>

          <div className="popup-row">
            <span>Direction</span>

            <span
              className={
                side === "BUY"
                  ? "green"
                  : "red"
              }
            >
              {side === "BUY"
                ? "BUY ↑"
                : "SELL ↓"}
            </span>

          </div>

          <div className="popup-row">
            <span>Investment</span>

            <span>

              {Number(amount).toLocaleString()} USDT

            </span>

          </div>

          <div className="popup-row">
            <span>Profit</span>

            <span className="green">

              {trade.profit}%

            </span>

          </div>

          <div className="popup-row">
            <span>Duration</span>

            <span>

              {trade.duration}s

            </span>

          </div>

        </div>

        <div className="popup-footer">

          Please wait while your trade is being settled...

        </div>

      </div>

    </div>
  );
}