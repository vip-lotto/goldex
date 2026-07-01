import "../styles/trade.css";
import { useEffect, useState } from "react";

import TradingChart from "../components/TradingChart";
import TradePanel from "../components/TradePanel";

export default function Trade() {

  const [market, setMarket] = useState({
    name: "Gold",
    code: "XAUUSD",
    symbol: "GC=F",
  });

  useEffect(() => {

    const data = localStorage.getItem("selectedMarket");

    if (data) {

      try {

        setMarket(JSON.parse(data));

      } catch (err) {

        console.error(err);

      }

    }

  }, []);

  return (

    <div className="trade-page">

      <div className="trade-content">

        <div className="trade-chart-area">

          <div className="card">

            <div className="section-title">
              {market.name} ({market.code})
            </div>

            <TradingChart
              symbol={market.symbol}
            />

          </div>

        </div>

        <div className="trade-side">

          <div className="card panel-box">

            <TradePanel market={market} />

          </div>

        </div>

      </div>

    </div>

  );

}