import { useNavigate } from "react-router-dom";

const FALLBACK_ICON =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";


function getLogo(item) {

  const logos = {

    // ==========================
    // Crypto
    // ==========================

    BTCUSDT: "https://assets.coincap.io/assets/icons/btc@2x.png",
    ETHUSDT: "https://assets.coincap.io/assets/icons/eth@2x.png",
    BNBUSDT: "https://assets.coincap.io/assets/icons/bnb@2x.png",
    SOLUSDT: "https://assets.coincap.io/assets/icons/sol@2x.png",
    XRPUSDT: "https://assets.coincap.io/assets/icons/xrp@2x.png",
    DOGEUSDT: "https://assets.coincap.io/assets/icons/doge@2x.png",
    ADAUSDT: "https://assets.coincap.io/assets/icons/ada@2x.png",
    SUIUSDT: "https://assets.coincap.io/assets/icons/sui@2x.png",

    AVAXUSDT: "https://assets.coincap.io/assets/icons/avax@2x.png",
    LINKUSDT: "https://assets.coincap.io/assets/icons/link@2x.png",
    TONUSDT: "https://assets.coincap.io/assets/icons/ton@2x.png",
    TRXUSDT: "https://assets.coincap.io/assets/icons/trx@2x.png",
    LTCUSDT: "https://assets.coincap.io/assets/icons/ltc@2x.png",
    BCHUSDT: "https://assets.coincap.io/assets/icons/bch@2x.png",
    DOTUSDT: "https://assets.coincap.io/assets/icons/dot@2x.png",

    MATICUSDT:
      "https://assets.coincap.io/assets/icons/matic@2x.png",

    ARBUSDT:
      "https://assets.coincap.io/assets/icons/arb@2x.png",

    OPUSDT:
      "https://assets.coincap.io/assets/icons/op@2x.png",

    ATOMUSDT:
      "https://assets.coincap.io/assets/icons/atom@2x.png",

    NEARUSDT:
      "https://assets.coincap.io/assets/icons/near@2x.png",

    FILUSDT:
      "https://assets.coincap.io/assets/icons/fil@2x.png",

    APTUSDT:
      "https://assets.coincap.io/assets/icons/apt@2x.png",

    PEPEUSDT:
      "https://assets.coincap.io/assets/icons/pepe@2x.png",

    SHIBUSDT:
      "https://assets.coincap.io/assets/icons/shib@2x.png",

    UNIUSDT:
      "https://assets.coincap.io/assets/icons/uni@2x.png",


    // ==========================
    // Stocks
    // ==========================

    AAPL:
      "https://cdn.simpleicons.org/apple/000000",

    TSLA:
      "https://cdn.simpleicons.org/tesla/E82127",

    MSFT:
      "https://cdn.simpleicons.org/microsoft/0078D4",

    NVDA:
      "https://cdn.simpleicons.org/nvidia/76B900",

    AMZN:
      "https://cdn.simpleicons.org/amazon/FF9900",

    META:
      "https://cdn.simpleicons.org/meta/0866FF",

    GOOGL:
      "https://cdn.simpleicons.org/google/4285F4",

    NFLX:
      "https://cdn.simpleicons.org/netflix/E50914",

    AMD:
      "https://cdn.simpleicons.org/amd/ED1C24",

    INTC:
      "https://cdn.simpleicons.org/intel/0071C5",

    ORCL:
      "https://cdn.simpleicons.org/oracle/F80000",

    UBER:
      "https://cdn.simpleicons.org/uber/000000",

    DIS:
      "https://cdn.simpleicons.org/disney/113CCF",

    COIN:
      "https://cdn.simpleicons.org/coinbase/0052FF",


    // ==========================
    // Commodities
    // ==========================

    XAUUSD:
      "https://img.icons8.com/color/96/gold-bars.png",

    XAGUSD:
      "https://img.icons8.com/color/96/silver-bars.png",

    XPTUSD:
      "https://img.icons8.com/color/96/platinum.png",

    XPDUSD:
      "https://img.icons8.com/color/96/metal.png",

    COPPER:
      "https://img.icons8.com/color/96/copper.png",

    NICKEL:
      "https://img.icons8.com/color/96/nickel.png",

    ALUMINUM:
      "https://img.icons8.com/color/96/aluminum.png",

    ZINC:
      "https://img.icons8.com/color/96/zinc.png",

    LEAD:
      "https://img.icons8.com/color/96/lead.png",

    TIN:
      "https://img.icons8.com/color/96/tin.png",

    COBALT:
      "https://img.icons8.com/color/96/cobalt.png",

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

          onError={(e)=>{

            e.currentTarget.onerror = null;

            e.currentTarget.src = FALLBACK_ICON;

          }}

        />


        <div>


          <div className="market-name">

            {item.name}

          </div>


          <div className="market-symbol">

            {item.code}


            

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