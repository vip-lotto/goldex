const tabs = [
  "All",
  "Commodities",
  "Crypto",
  "Stocks",
];

export default function MarketTabs({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="market-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={activeTab === tab ? "tab active" : "tab"}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}