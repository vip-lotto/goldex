import { useNavigate } from "react-router-dom";

const FALLBACK_ICON = "https://img.icons8.com/fluency/96/coins.png";

function getLogo(item) {
  if (item.icon) return item.icon;

  const logos = {
    // ===== Commodities =====
    XAUUSD: "https://img.icons8.com/color/96/gold-bars.png",
    XAGUSD: "https://img.icons8.com/color/96/silver-bars.png",

    // ===== Crypto =====
    BTCUSDT: "https://assets.coincap.io/assets/icons/btc@2x.png",
    ETHUSDT: "https://assets.coincap.io/assets/icons/eth@2x.png",
    BNBUSDT: "https://assets.coincap.io/assets/icons/bnb@2x.png",
    SOLUSDT: "https://assets.coincap.io/assets/icons/sol@2x.png",
    DOGEUSDT: "https://assets.coincap.io/assets/icons/doge@2x.png",
    ADAUSDT: "https://assets.coincap.io/assets/icons/ada@2x.png",
    XRPUSDT: "https://assets.coincap.io/assets/icons/xrp@2x.png",
    SUIUSDT: "https://assets.coincap.io/assets/icons/sui@2x.png",

    // ===== Forex =====
    EURUSD: "https://img.icons8.com/color/96/euro-pound-exchange.png",
    GBPUSD: "https://img.icons8.com/color/96/british-pound.png",
    USDJPY: "https://img.icons8.com/color/96/japanese-yen.png",

    // ===== Stocks =====
    AAPL: "https://cdn.simpleicons.org/apple",
    TSLA: "https://cdn.simpleicons.org/tesla",
    AMZN: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    NVDA: "https://cdn.simpleicons.org/nvidia",

    // ===== Indices =====
    SPX500: "https://img.icons8.com/color/96/combo-chart--v1.png",
    NAS100: "https://img.icons8.com/color/96/line-chart.png",
  };

  return logos[item.code] || FALLBACK_ICON;
}

export default function MarketItem({ item }) {
  const navigate = useNavigate();

  function openTrade() {
    localStorage.setItem("selectedMarket", JSON.stringify(item));
    navigate("/trade");
  }

  const decimals = item.decimals ?? 2;
  const price = Number(item.price ?? 0);
  const change = Number(item.change ?? 0);

  return (
    <div className="market-item" onClick={openTrade}>
      {/* Left */}
      <div className="market-left">
        <img
          className="market-logo"
          src={getLogo(item)}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = FALLBACK_ICON;
          }}
        />

        <div>
          <div className="market-name">{item.name}</div>
          <div className="market-symbol">{item.code}</div>
        </div>
      </div>

      {/* Center */}
      <div className="market-center">
        {price.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
      </div>

      {/* Right */}
      <div
        className={`market-change ${
          change >= 0 ? "up" : "down"
        }`}
      >
        {change >= 0 ? "+" : ""}
        {change.toFixed(2)}%
      </div>
    </div>
  );
}