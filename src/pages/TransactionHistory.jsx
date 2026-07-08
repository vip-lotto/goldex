import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  TrendingUp,
  Clock3,
  CheckCircle2,
  XCircle
} from "lucide-react";

import { getTransactions } from "../lib/transactionApi";
import { useTranslation } from "react-i18next";

import "../styles/transactionHistory.css";

export default function TransactionHistory() {

  const navigate = useNavigate();

  const { t } = useTranslation();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("all");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {

    loadData();

    window.addEventListener(
      "walletUpdated",
      loadData
    );

    return () =>
      window.removeEventListener(
        "walletUpdated",
        loadData
      );

  }, []);

  async function loadData() {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) return;

    const data =
      await getTransactions(user.id);

    setTransactions(data || []);

    setLoading(false);

  }

  const summary = useMemo(() => {

    let deposit = 0;
    let withdraw = 0;
    let transfer = 0;
    let trade = 0;

    transactions.forEach(item => {

      switch (item.type) {

        case "deposit":
          deposit += Number(item.amount);
          break;

        case "withdraw":
          withdraw += Number(item.amount);
          break;

        case "transfer":
          transfer += Number(item.amount);
          break;

        case "trade":
          trade += Number(item.amount);
          break;

        default:
          break;

      }

    });

    return {
      deposit,
      withdraw,
      transfer,
      trade
    };

  }, [transactions]);

  const list = useMemo(() => {

    let data = [...transactions];

    if (filter !== "all") {

      data = data.filter(
        item => item.type === filter
      );

    }

    if (keyword.trim() !== "") {

      data = data.filter(item =>

        item.description
          ?.toLowerCase()
          .includes(
            keyword.toLowerCase()
          )

      );

    }

    return data;

  }, [transactions, filter, keyword]);

  return (

    <div className="transaction-page">

      {/* ================= Header ================= */}

      <div className="transaction-header">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={22} />
        </button>

        <div>

          <h2>{t("transactionHistory")}</h2>

<span>
  {transactions.length} {t("records")}
</span>

        </div>

      </div>

      {/* ================= Dashboard ================= */}

      <div className="history-dashboard">

        <div className="dashboard-card deposit">

          <span>{t("deposit")}</span>

          <h3>
            USDT{summary.deposit.toLocaleString()}
          </h3>

        </div>

        <div className="dashboard-card withdraw">

          <span>{t("withdraw")}</span>

          <h3>
            USDT{summary.withdraw.toLocaleString()}
          </h3>

        </div>

        <div className="dashboard-card transfer">

          <span>{t("transfer")}</span>

          <h3>
            USDT{summary.transfer.toLocaleString()}
          </h3>

        </div>

        <div className="dashboard-card trade">

          <span>{t("trade")}</span>

          <h3>
            USDT{summary.trade.toLocaleString()}
          </h3>

        </div>

      </div>

      {/* ================= Search ================= */}

      <div className="history-search">

        <Search size={18} />

        <input
          type="text"
          placeholder={t("searchRecords")}
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
          }
        />

      </div>

      {/* ================= Filter ================= */}

      <div className="history-tabs">

        <button
          className={
            filter === "all"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("all")
          }
        >
          {t("all")}
        </button>

        <button
          className={
            filter === "deposit"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("deposit")
          }
        >
          {t("deposit")}
        </button>

        <button
          className={
            filter === "withdraw"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("withdraw")
          }
        >
          {t("withdraw")}
        </button>

        <button
          className={
            filter === "transfer"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("transfer")
          }
        >
          {t("transfer")}
        </button>

        <button
          className={
            filter === "trade"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("trade")
          }
        >
          {t("trade")}
        </button>

      </div>

            {/* ================= รายการ ================= */}

      {loading ? (

        <div className="history-empty">

          <div className="loader"></div>

          <p>{t("loadingData")}</p>

        </div>

      ) : list.length === 0 ? (

        <div className="history-empty">

          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt=""
          />

          <h3>{t("noRecords")}</h3>

          

        </div>

      ) : (

        list.map((item) => (

          <div
            className="history-card"
            key={item.id}
          >

            <div className="history-left">

              <div
                className={`history-icon ${item.type}`}
              >

                {

                  item.type === "deposit" ?

                  <ArrowDownCircle size={24}/>

                  :

                  item.type === "withdraw" ?

                  <ArrowUpCircle size={24}/>

                  :

                  item.type === "transfer" ?

                  <Repeat size={24}/>

                  :

                  <TrendingUp size={24}/>

                }

              </div>

              <div className="history-detail">

                <h3>
                  {
                    item.type === "deposit"
                      ? `${t("deposit")} USDT`
                      : item.type === "withdraw"
                      ? `${t("withdraw")} USDT`
                      : item.type === "transfer"
                      ? `${t("transfer")} USDT`
                      : item.type === "trade"
                      ? item.description
                      : item.description
                  }
                </h3>

                <span>

                  {

                    new Date(
                      item.created_at
                    ).toLocaleString()

                  }

                </span>

              </div>

            </div>

            <div className="history-right">

              <div
                className={
                  item.type === "withdraw"
                  ? "amount minus"
                  : "amount plus"
                }
              >

                {

                  item.type === "withdraw"

                  ? "-"

                  : "+"

                }

                USDT

                {

                  Number(
                    item.amount
                  ).toLocaleString()

                }

              </div>

              <div className={`status ${item.status}`}>

  {

    ["pending","processing"].includes(item.status)

    ?

    <Clock3 size={14}/>

    :

    ["success","approved","finished"].includes(item.status)

    ?

    <CheckCircle2 size={14}/>

    :

    <XCircle size={14}/>

  }

  <span>

    {

      ["pending","processing"].includes(item.status)

      ? t("pending")

      :

      ["success","approved","finished"].includes(item.status)

      ? t("success")

      :

      item.status === "rejected"

      ? t("rejected")

      : t("failed")

    }

  </span>

</div>

            </div>

          </div>

        ))

      )}

    </div>

  );

}