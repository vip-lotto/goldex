import { useNavigate } from "react-router-dom";

const FALLBACK_ICON =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

function getLogo(item) {
  const logos = {

    // ==========================
    // Commodities
    // ==========================

    XAUUSD: "https://img.icons8.com/color/96/gold-bars.png",

    // ==========================
    // Crypto
    // ==========================

    BTCUSDT: "https://assets.coincap.io/assets/icons/btc@2x.png",
    ETHUSDT: "https://assets.coincap.io/assets/icons/eth@2x.png",
    BNBUSDT: "https://assets.coincap.io/assets/icons/bnb@2x.png",
    SOLUSDT: "https://assets.coincap.io/assets/icons/sol@2x.png",
    DOGEUSDT: "https://assets.coincap.io/assets/icons/doge@2x.png",
    ADAUSDT: "https://assets.coincap.io/assets/icons/ada@2x.png",
    XRPUSDT: "https://assets.coincap.io/assets/icons/xrp@2x.png",
    SUIUSDT: "https://assets.coincap.io/assets/icons/sui@2x.png",

    AVAXUSDT: "https://assets.coincap.io/assets/icons/avax@2x.png",
    LINKUSDT: "https://assets.coincap.io/assets/icons/link@2x.png",
    TONUSDT: "https://assets.coincap.io/assets/icons/ton@2x.png",
    TRXUSDT: "https://assets.coincap.io/assets/icons/trx@2x.png",
    LTCUSDT: "https://assets.coincap.io/assets/icons/ltc@2x.png",
    BCHUSDT: "https://assets.coincap.io/assets/icons/bch@2x.png",
    DOTUSDT: "https://assets.coincap.io/assets/icons/dot@2x.png",

    // ==========================
    // Stocks
    // ==========================

    AAPL: "https://cdn.simpleicons.org/apple",
    TSLA: "https://cdn.simpleicons.org/tesla",
    AMZN: "https://cdn.simpleicons.org/amazon",
    NVDA: "https://cdn.simpleicons.org/nvidia",

  };

  return logos[item.code] || FALLBACK_ICON;
}

export default function MarketItem({ item }) {

  const navigate = useNavigate();

  const openTrade = () => {

    localStorage.setItem(
      "selectedMarket",
      JSON.stringify(item)
    );

    navigate("/trade");

  };

  const price = Number(item.price ?? 0);
  const change = Number(item.change ?? 0);
  const decimals = item.decimals ?? 2;

  return (

    <div
      className="market-item"
      onClick={openTrade}
    >

      <div className="market-left">

        <img
          className="market-logo"
          src={getLogo(item)}
          alt={item.name}
          onError={(e) => (
            e.target.src = FALLBACK_ICON
          )}
        />

        <div>

          <div className="market-name">
            {item.name}
          </div>

          <div className="market-symbol">

            {item.code}

            <span
              className={
                item.status === "online"
                  ? "market-live"
                  : "market-offline"
              }
            >
              {item.status === "online"
                ? " ● LIVE"
                : " ● OFFLINE"}
            </span>

          </div>

        </div>

      </div>

      <div className="market-price">

        $

        {price.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}

      </div>

      <div
        className={`market-percent ${
          change >= 0
            ? "up"
            : "down"
        }`}
      >

        {change >= 0
          ? "▲ +"
          : "▼ "}

        {Math.abs(change).toFixed(2)}%

      </div>

    </div>

  );

}