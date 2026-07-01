import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Clock3
} from "lucide-react";

import "../styles/orders.css";

export default function Orders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("all");

  useEffect(() => {

    loadOrders();

  }, []);

  async function loadOrders() {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {

      navigate("/login");

      return;

    }

    setLoading(true);

    const {
      data,
      error
    } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", user.id)
      .order("id", {
        ascending: false
      });

    if (error) {

      console.log(error);

      setLoading(false);

      return;

    }

    setOrders(data || []);

    setLoading(false);

  }

  const filteredOrders = useMemo(() => {

    switch (filter) {

      case "trading":

        return orders.filter(
          item => item.status === "trading"
        );

      case "win":

        return orders.filter(
          item => item.result === "win"
        );

      case "lose":

        return orders.filter(
          item => item.result === "lose"
        );

      default:

        return orders;

    }

  }, [orders, filter]);

    return (

    <div className="orders-page">

      {/* ================= Header ================= */}

      <div className="orders-header">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >

          <ArrowLeft size={22} />

        </button>

        <h2>

          Orders

        </h2>

      </div>

      {/* ================= Filter ================= */}

      <div className="orders-filter">

        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "trading" ? "active" : ""}
          onClick={() => setFilter("trading")}
        >
          Trading
        </button>

        <button
          className={filter === "win" ? "active" : ""}
          onClick={() => setFilter("win")}
        >
          Win
        </button>

        <button
          className={filter === "lose" ? "active" : ""}
          onClick={() => setFilter("lose")}
        >
          Lose
        </button>

      </div>

      {/* ================= Loading ================= */}

      {

        loading && (

          <div className="orders-loading">

            Loading...

          </div>

        )

      }

      {

        !loading &&
        filteredOrders.length === 0 && (

          <div className="orders-empty">

            No Orders

          </div>

        )

      }

      {/* ================= Order List ================= */}

      <div className="orders-list">

              {

        !loading &&

        filteredOrders.map((item) => (

          <div
            key={item.id}
            className="order-card"
            onClick={() =>
              navigate(`/order/${item.id}`)
            }
          >

            <div className="order-top">

              <div className="order-left">

                <div
                  className={
                    item.side === "BUY"
                      ? "order-side buy"
                      : "order-side sell"
                  }
                >

                  {item.side}

                </div>

                <div className="order-coin">

                  {item.coin}

                </div>

              </div>

              <div
                className={
                  item.result === "win"
                    ? "order-result win"
                    : item.result === "lose"
                    ? "order-result lose"
                    : "order-result trading"
                }
              >

                {

                  item.status === "trading"
                    ? "TRADING"
                    : item.result?.toUpperCase()

                }

              </div>

            </div>

            <div className="order-info">

              <div>

                <Clock3 size={15} />

                {item.duration} Minute

              </div>

              <div>

                Amount

                <strong>

                  ${Number(item.amount).toLocaleString()}USDT

                </strong>

              </div>

            </div>

            <div className="order-bottom">

              <div>

                Profit

              </div>

              <div
                className={
                  item.result === "win"
                    ? "green"
                    : item.result === "lose"
                    ? "red"
                    : ""
                }
              >

                {

                  item.result === "win"

                    ? `+$${Number(
                        item.profit_amount || 0
                      ).toLocaleString()} USDT`

                    : item.result === "lose"

                    ? `-$${Number(
                        item.amount
                      ).toLocaleString()}USDT`

                    : "-"

                }

              </div>

            </div>

            <div className="order-date">

              {

                item.finished_at
                  ? new Date(
                      item.finished_at
                    ).toLocaleString()

                  : new Date(
                      item.started_at
                    ).toLocaleString()

              }

            </div>

          </div>

        ))

      }

      </div>

            </div>

    

  );

}