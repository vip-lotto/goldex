import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Clock } from "lucide-react";
import { supabase } from "../lib/supabase";
import "../styles/kyc-status.css";

export default function KYCUnderReview() {

  const navigate = useNavigate();

  useEffect(() => {

    checkStatus();

    const timer = setInterval(() => {
      checkStatus();
    }, 5000);

    return () => clearInterval(timer);

  }, []);

  async function checkStatus() {

    const localUser = JSON.parse(
  localStorage.getItem("user")
);

console.log("LOCAL USER =", localUser);

if (!localUser) {
  navigate("/login");
  return;
}

    const { data } = await supabase
      .from("kyc")
      .select("status")
      .eq("user_id", localUser.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

      console.log("KYC DATA =", data);

    if (!data) {
  console.log("KYC NOT FOUND");
  return;
}

console.log(data);

    if (data.status === "approved") {
      navigate("/kyc/approved");
      return;
    }

    if (data.status === "rejected") {
      navigate("/kyc/rejected");
      return;
    }

  }

  return (

    <div className="kyc-status-page">

      <div className="kyc-status-card">

        <div className="status-icon pending">

          <Clock size={70} />

        </div>

        <h2>Verification Under Review</h2>

        <p>

          Your identity verification has been submitted successfully.

        </p>

        <p>

          Our compliance team is reviewing your documents.

        </p>

        <p>

          This usually takes a few minutes.

        </p>

        <button
          className="status-btn"
          onClick={() => navigate("/mine")}
        >
          Back
        </button>

      </div>

    </div>

  );

}