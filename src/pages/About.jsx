import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "../styles/about.css";

export default function About() {

  const navigate = useNavigate();

  const { t } = useTranslation();

  return (

    <div className="about-page">

      {/* ================= Header ================= */}

      <div className="about-header">

        <button
          className="about-back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={22}/>
        </button>

        <h2>{t("about")}</h2>

      </div>

      {/* ================= Main Card ================= */}

      <div className="about-card">

        {/* Logo */}

        <div className="about-logo">

          <div className="about-logo-icon">

            <ShieldCheck size={60}/>

          </div>

          <h1>Trust</h1>

          <span>Version 1.0.0</span>

        </div>

        {/* ================= Agreement ================= */}

        <div className="about-section">

          <h3>
            Agreement to Terms
          </h3>

          <p>

            Web3-contract and its affiliates provide
            blockchain technology services through
            websites and mobile applications.

            By accessing or using our Services you
            acknowledge that you have read,
            understood and accepted these Terms.

            If you do not agree with these Terms,
            please discontinue using our Services.

            We do not provide financial advice,
            investment advice or trading advice.

            Every cryptocurrency transaction is
            completely your own responsibility.

          </p>

        </div>

        {/* ================= Privacy ================= */}

        <div className="about-section">

          <h3>
            Privacy Policy
          </h3>

          <p>

            We respect your privacy.

            Personal information is collected only
            for providing better services, improving
            security and complying with applicable
            laws and regulations.

            We do not sell your personal data.

            Your information is protected using
            industry-standard security practices.

          </p>

        </div>

        {/* ================= Eligibility ================= */}

        <div className="about-section">

          <h3>
            Eligibility
          </h3>

          <ul>

            <li>
              You must be at least 18 years old.
            </li>

            <li>
              You must have full legal capacity.
            </li>

            <li>
              You agree to comply with the laws of
              your country.
            </li>

            <li>
              You are responsible for protecting
              your own account.
            </li>

            <li>
              Never share your password or wallet
              credentials.
            </li>

          </ul>

        </div>

                {/* ================= Digital Assets ================= */}

        <div className="about-section">

          <h3>
            Digital Assets
          </h3>

          <p>

            Cryptocurrency and digital assets are
            highly volatile.

            Prices may rise or fall dramatically
            within a short period of time.

            Blockchain transactions are generally
            irreversible once confirmed.

            Always verify wallet addresses,
            blockchain networks and transaction
            amounts before sending assets.

            Trust is not responsible for losses
            caused by incorrect wallet addresses,
            wrong networks or user mistakes.

          </p>

        </div>

        {/* ================= Risk Warning ================= */}

        <div className="about-section">

          <h3>
            Risk Warning
          </h3>

          <p>

            Trading digital assets involves
            substantial financial risk.

            The value of cryptocurrencies can
            increase or decrease rapidly.

            You should carefully evaluate your
            financial situation before making
            any investment decisions.

            Never invest more money than you
            can afford to lose.

          </p>

        </div>

        {/* ================= Disclaimer ================= */}

        <div className="about-section">

          <h3>
            Disclaimer
          </h3>

          <p>

            Trust provides technology services
            only.

            We do not guarantee profits,
            investment returns or future market
            performance.

            We are not responsible for losses
            resulting from user mistakes,
            forgotten passwords, private key
            loss, phishing attacks, blockchain
            failures or network congestion.

            Every transaction is initiated
            entirely by the user.

          </p>

        </div>

        {/* ================= Compliance ================= */}

        <div className="about-section">

          <h3>
            Compliance
          </h3>

          <p>

            We reserve the right to suspend,
            restrict or terminate accounts that
            violate applicable laws, these Terms
            of Service or our internal policies.

            Identity verification (KYC) may be
            required where required by law.

          </p>

        </div>

        {/* ================= Footer ================= */}

        <div className="about-footer">

          <p>

            © 2026 Trust

          </p>

          <span>

            All Rights Reserved

          </span>

        </div>

      </div>

    </div>

  );

}