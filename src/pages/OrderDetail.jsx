import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ArrowLeft } from "lucide-react";
import "../styles/order-detail.css";

export default function OrderDetail() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {

    loadOrder();

  }, []);

  async function loadOrder() {

    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {

      setOrder(data);

    }

  }

  if (!order) {

    return (

      <div className="order-detail-page">

        Loading...

      </div>

    );

  }

  return (

    <div className="order-detail-page">

      <div className="detail-header">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >

          <ArrowLeft size={22}/>

        </button>

        <h2>Order Detail</h2>

      </div>

      <div className="detail-card">

        <div><b>Order ID</b><span>#{order.id}</span></div>

        <div><b>Coin</b><span>{order.coin}</span></div>

        <div><b>Type</b><span>{order.side}</span></div>

        <div><b>Amount</b><span>${Number(order.amount).toLocaleString()}</span></div>

        <div><b>Duration</b><span>{order.duration} Minute</span></div>

        <div><b>Profit %</b><span>{order.profit}%</span></div>

        <div><b>Profit</b><span>${Number(order.profit_amount || 0).toLocaleString()}</span></div>

        <div><b>Payout</b><span>${Number(order.payout || 0).toLocaleString()}</span></div>

        <div><b>Open Price</b><span>{order.open_price}</span></div>

        <div><b>Close Price</b><span>{order.close_price}</span></div>

        <div><b>Result</b><span>{order.result}</span></div>

        <div><b>Status</b><span>{order.status}</span></div>

        <div><b>Started</b><span>{order.started_at}</span></div>

        <div><b>Finished</b><span>{order.finished_at}</span></div>

      </div>

    </div>

  );

}