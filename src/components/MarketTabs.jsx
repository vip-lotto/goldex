
import { useTranslation } from "react-i18next";
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

  const { t } = useTranslation();

  return (
    <div className="market-tabs">
      {tabs.map((tab) => (
        <button
  key={tab}
  className={activeTab === tab ? "tab active" : "tab"}
  onClick={() => setActiveTab(tab)}
>
  {t(tab.toLowerCase())}
</button>
      ))}
    </div>
  );
}