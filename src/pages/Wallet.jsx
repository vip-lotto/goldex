import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  History,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import BottomNav from "../components/BottomNav";

import "../styles/wallet.css";

export default function Wallet() {

  const navigate = useNavigate();

  const [balance, setBalance] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {

    if (!user) return;

    const { data } =
      await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

    if (data) {
      setBalance(
        Number(data.balance)
      );
    }

    setLoading(false);
  };

  return (
    <div className="wallet-page">

      <div className="wallet-header">
        <h2>Wallet</h2>
      </div>

      <div className="wallet-card">

        <p>Available Balance</p>

        <h1>
          {loading
            ? "Loading..."
            : `$${balance.toFixed(2)}`
          }
        </h1>

      </div>

      <div className="wallet-actions">

        <button
          onClick={() =>
            navigate("/deposit")
          }
        >
          <ArrowDownToLine />
          Deposit
        </button>

        <button
          onClick={() =>
            navigate("/withdraw")
          }
        >
          <ArrowUpFromLine />
          Withdraw
        </button>

        <button
          onClick={() =>
            navigate("/transfer")
          }
        >
          <ArrowLeftRight />
          Transfer
        </button>

        <button
          onClick={() =>
            navigate("/history")
          }
        >
          <History />
          History
        </button>

      </div>

      <BottomNav />

    </div>
  );
}