export default function Login() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "30px",
          borderRadius: "15px",
          width: "320px"
        }}
      >
        <h1 style={{ color: "gold", textAlign: "center" }}>
          GOLDEX
        </h1>

        <input
          placeholder="Username"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <button
          style={{
            width: "100%",
            padding: "10px",
            background: "gold",
            border: "none"
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}