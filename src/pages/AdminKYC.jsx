import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./AdminKYC.css";

export default function AdminKYC() {

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    loadKYC();
  }, []);

  async function loadKYC() {

    setLoading(true);

    const { data, error } = await supabase
      .from("kyc")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setList(data || []);
    }

    setLoading(false);

  }

  async function approve(id) {

    const ok = window.confirm(
      "Approve this KYC?"
    );

    if (!ok) return;

    const { error } = await supabase
      .from("kyc")
      .update({
        status: "approved",
      })
      .eq("id", id);

    if (!error) {
      loadKYC();
    }

  }

  async function reject(id) {

    const ok = window.confirm(
      "Reject this KYC?"
    );

    if (!ok) return;

    const { error } = await supabase
      .from("kyc")
      .update({
        status: "rejected",
      })
      .eq("id", id);

    if (!error) {
      loadKYC();
    }

  }

  return (

    <div className="admin-page">

      <h2>Admin KYC</h2>

      {loading && (
        <p>Loading...</p>
      )}

      {!loading && list.length === 0 && (
        <p>No KYC request.</p>
      )}

      {list.map((item) => (

        <div
          className="kyc-item"
          key={item.id}
        >

          <div className="kyc-info">

            <h3>

              {item.first_name} {item.last_name}

            </h3>

            <p>

              {item.document_type}

            </p>

            <p>

              {item.id_number}

            </p>

            <p>

              {item.country}

            </p>

            <p>

              Status : {item.status}

            </p>

          </div>

          <div className="kyc-images">

            <a
              href={item.id_card_image}
              target="_blank"
              rel="noreferrer"
            >

              <img
                src={item.id_card_image}
                alt=""
              />

            </a>

            <a
              href={item.selfie_image}
              target="_blank"
              rel="noreferrer"
            >

              <img
                src={item.selfie_image}
                alt=""
              />

            </a>

          </div>

          {item.status === "pending" && (

            <div className="kyc-actions">

              <button
                className="approve-btn"
                onClick={() =>
                  approve(item.id)
                }
              >

                Approve

              </button>

              <button
                className="reject-btn"
                onClick={() =>
                  reject(item.id)
                }
              >

                Reject

              </button>

            </div>

          )}

        </div>

      ))}

    </div>

  );

}