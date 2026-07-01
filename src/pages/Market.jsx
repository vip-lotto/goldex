import { useEffect, useMemo, useState } from "react";

import MarketHeader from "../components/MarketHeader";
import MarketTabs from "../components/MarketTabs";
import MarketList from "../components/MarketList";

import { getMarkets } from "../lib/marketApi";

import "../styles/market.css";

export default function Market() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  async function loadMarkets() {
    try {
      const data = await getMarkets();
      setMarkets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMarkets();

    const timer = setInterval(() => {
      loadMarkets();
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const filteredMarkets = useMemo(() => {
    return markets.filter((item) => {
      const matchSearch =
        item.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.code
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchTab =
        activeTab === "All"
          ? true
          : item.category === activeTab;

      return matchSearch && matchTab;
    });
  }, [markets, search, activeTab]);

  return (
    <div className="market-page">

      <MarketHeader
        search={search}
        setSearch={setSearch}
        total={filteredMarkets.length}
        onRefresh={loadMarkets}
      />

      <MarketTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="market-header-simple">
        <div>รายการ</div>
        <div>ราคาล่าสุด</div>
        <div>24 ชม. %</div>
      </div>

      {loading ? (
        <div className="market-loading">
          Loading data...
        </div>
      ) : (
        <MarketList markets={filteredMarkets} />
      )}

    </div>
  );
}