const tabs = [
  { key: "All", label: "All" },
  { key: "Commodities", label: "Commodities" },
  { key: "Crypto", label: "Crypto" },
  { key: "Forex", label: "Forex" },
  { key: "Stocks", label: "Stocks" },
  { key: "Indices", label: "Indices" },
];

export default function MarketTabs({
  activeTab = "All",
  setActiveTab,
}) {
  return (
    <div className="market-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab ${activeTab === tab.key ? "active" : ""}`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}