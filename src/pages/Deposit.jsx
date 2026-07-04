import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import InternalDeposit from "./InternalDeposit";
import ExternalDeposit from "./ExternalDeposit";

import "../styles/deposit.css";

export default function Deposit() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("internal");

  return (
    <div className="deposit-page">

      <div className="deposit-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={22} />
        </button>

        <h2>Deposit</h2>
      </div>

      <div className="deposit-tabs">
        <button
          className={
            tab === "internal"
              ? "tab-btn active"
              : "tab-btn"
          }
          onClick={() =>
            setTab("internal")
          }
        >
          Internal Transfer
        </button>

        <button
          className={
            tab === "external"
              ? "tab-btn active"
              : "tab-btn"
          }
          onClick={() =>
            setTab("external")
          }
        >
          Crypto Deposit
        </button>
      </div>

      {tab === "internal" ? (
        <InternalDeposit />
      ) : (
        <ExternalDeposit />
      )}
    </div>
  );
}