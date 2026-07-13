import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/kyc-status.css";

export default function KYCRejected() {

  const navigate = useNavigate();

  return (

    <div className="kyc-status-page">

      <div className="kyc-status-card">

        <div className="status-icon reject">

          <XCircle size={72} />

        </div>

        <h2>KYC Verification Rejected</h2>

        <p>

          Unfortunately your identity verification was not approved.

        </p>

        <p>

          Please check your submitted information and upload clear documents.

        </p>

        <p>

          After correcting the information, you can submit your KYC again.

        </p>

        <button
          className="status-btn"
          onClick={() => navigate("/kyc-form")}
        >

          Submit Again

        </button>

      </div>

    </div>

  );

}