export default function MarketHeader({
  search = "",
  setSearch,
  total = 0,
  onRefresh,
}) {
  return (
    <div className="market-header">
      <div className="market-header-top">
        <div>
          <h2 className="market-title">Market</h2>
          <span className="market-count">
            {total} Markets
          </span>
        </div>

        <button
          className="refresh-btn"
          onClick={onRefresh}
          title="Refresh"
        >
          ↻
        </button>
      </div>

      <div className="search-box">
        <span className="search-icon">🔍</span>

        <input
          type="text"
          placeholder="Search Gold, BTC, EUR..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}