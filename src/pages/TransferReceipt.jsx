import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Copy, Home } from "lucide-react";

export default function TransferReceipt() {

  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#111318",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        ไม่มีข้อมูลใบเสร็จ
      </div>
    );
  }

  const copyTx = () => {
    navigator.clipboard.writeText(state.txid);
    alert("Copied");
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#111318",
        color: "#fff",
        padding: 20
      }}
    >

      <div
        style={{
          textAlign: "center",
          marginTop: 20
        }}
      >

        <CheckCircle
          size={90}
          color="#18c964"
        />

        <h1>Transfer Successful</h1>

        <p
          style={{
            color: "#999"
          }}
        >
          Your transfer has been completed.
        </p>

      </div>

      <div
        style={{
          marginTop: 30,
          background: "#1b1f27",
          borderRadius: 20,
          padding: 20
        }}
      >

        <Row title="Amount" value={`${state.amount} ${state.coin}`} />

        <Row title="Network" value={state.network} />

        <Row title="Wallet" value={state.address} />

        <Row title="Time" value={state.time} />

        <div
          style={{
            marginTop: 15
          }}
        >

          <div
            style={{
              color: "#888",
              marginBottom: 5
            }}
          >
            Transaction ID
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#111318",
              padding: 12,
              borderRadius: 12
            }}
          >

            <span>{state.txid}</span>

            <Copy
              size={20}
              onClick={copyTx}
              style={{
                cursor: "pointer"
              }}
            />

          </div>

        </div>

      </div>

      <button
        onClick={() => navigate("/home")}
        style={{
          width: "100%",
          marginTop: 30,
          height: 55,
          border: "none",
          borderRadius: 30,
          background: "#18c964",
          color: "#000",
          fontWeight: "bold",
          fontSize: 18
        }}
      >

        <Home size={20} />

        {" "}Back Home

      </button>

    </div>

  );

}

function Row({ title, value }) {

  return (

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 18
      }}
    >

      <span
        style={{
          color: "#888"
        }}
      >
        {title}
      </span>

      <span>{value}</span>

    </div>

  );

}