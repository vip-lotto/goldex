import MarketItem from "./MarketItem";

export default function MarketList({
  markets = [],
  search = "",
  activeTab = "All",
}) {
  const keyword = search.trim().toLowerCase();

  const list = markets
    .filter((item) => {
      const matchSearch =
        keyword === "" ||
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword);

      const matchCategory =
        activeTab === "All" || item.category === activeTab;

      return matchSearch && matchCategory;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (list.length === 0) {
    return (
      <div className="empty-market">
        ไม่พบสินทรัพย์ที่ค้นหา
      </div>
    );
  }

  return (
    <div className="market-list">
      {list.map((item) => (
        <MarketItem
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}