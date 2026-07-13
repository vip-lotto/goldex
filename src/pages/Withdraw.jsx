import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import InternalWithdraw from "./InternalWithdraw";
import BankWithdraw from "./BankWithdraw";

import "../styles/withdraw.css";


export default function Withdraw() {

  const navigate = useNavigate();

  const [tab, setTab] =
    useState("crypto");

  return (

    <div className="withdraw-page">

      <div className="withdraw-header">

        <button
          className="withdraw-back-btn"
          onClick={() =>
            navigate("/home")
          }
        >
          <ArrowLeft size={22} />
        </button>

        <h2>Withdraw</h2>

      </div>

      <div className="withdraw-tabs">

        <button
          onClick={() =>
            setTab("crypto")
          }
          className={
            tab === "crypto"
              ? "withdraw-tab active"
              : "withdraw-tab"
          }
        >
          Crypto Withdrawal
        </button>

        <button
          onClick={() =>
            setTab("bank")
          }
          className={
            tab === "bank"
              ? "withdraw-tab active"
              : "withdraw-tab"
          }
        >
          Bank Withdrawal
        </button>

      </div>

      {
        tab === "crypto"
          ? <InternalWithdraw />
          : <BankWithdraw />
      }

    </div>

  );
}