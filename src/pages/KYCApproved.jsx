import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/kyc-status.css";

export default function KYCApproved() {

  const navigate = useNavigate();

  return (

    <div className="kyc-status-page">

      <div className="kyc-status-card">

        <div className="status-icon success">

          <CheckCircle size={72} />

        </div>

        <h2>Your identity has been verified</h2>

        <p>

          Congratulations!

        </p>

        <p>

          Your KYC verification has been approved successfully.

        </p>

        <p>

          You can now enjoy all features of TRUST without restrictions.

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