export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1120",
        color: "white",
        padding: "20px"
      }}
    >
      <h1 style={{ color: "gold" }}>GOLDEX</h1>

      <h2>XAU/USD</h2>

      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px"
        }}
      >
        <h1>$3,350.25</h1>
        <p>+12.50 (+0.37%)</p>
      </div>

      <div
        style={{
          background: "#1e293b",
          height: "250px",
          marginTop: "20px",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        กราฟทองคำ
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px"
        }}
      >
        <button
          style={{
            flex: 1,
            background: "green",
            color: "white",
            border: "none",
            padding: "15px"
          }}
        >
          BUY
        </button>

        <button
          style={{
            flex: 1,
            background: "red",
            color: "white",
            border: "none",
            padding: "15px"
          }}
        >
          SELL
        </button>
      </div>
    </div>
  );
}