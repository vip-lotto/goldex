import { useEffect, useRef } from "react";

export default function TradingChart({
  symbol = "GC=F",
}) {

  const container = useRef(null);

  useEffect(() => {

    if (!container.current) return;

    container.current.innerHTML = "";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container";

    const chart = document.createElement("div");
    chart.className = "tradingview-widget-container__widget";

    widget.appendChild(chart);

    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "1",
      timezone: "Asia/Bangkok",
      theme: "dark",
      style: "1",
      locale: "th",
      enable_publishing: false,
      allow_symbol_change: false,
      withdateranges: true,
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      save_image: false,
      studies: [
        "MASimple@tv-basicstudies",
        "RSI@tv-basicstudies",
        "MACD@tv-basicstudies",
      ],
    });

    widget.appendChild(script);

    container.current.appendChild(widget);

    return () => {

      if (container.current) {

        container.current.innerHTML = "";

      }

    };

  }, [symbol]);

  return (

    <div
      ref={container}
      style={{
        width: "100%",
        height: "600px",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />

  );

}