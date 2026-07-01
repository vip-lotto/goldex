export default function MarketHeader({
  search,
  setSearch,
  total = 0,
  onRefresh,
}) {
  return (
    <div className="market-header">

      <div className="market-title">

        <h2>Market</h2>

        <span className="market-count">
          {total} Markets
        </span>

      </div>

      <div className="search-box">

        <span className="search-icon">
          🔍
        </span>

        <input
          type="text"
          placeholder="Search market..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button
          className="refresh-btn"
          onClick={onRefresh}
        >
          ⟳
        </button>

      </div>

    </div>
  );
}