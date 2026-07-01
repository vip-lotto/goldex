import MarketItem from "./MarketItem";

export default function MarketList({ markets }) {
  if (!markets || markets.length === 0) {
    return (
      <div className="market-empty">
        ไม่มีข้อมูลตลาด
      </div>
    );
  }

  return (
    <div className="market-list">
      {markets.map((item) => (
        <MarketItem
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}