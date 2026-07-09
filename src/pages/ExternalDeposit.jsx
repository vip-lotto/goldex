import { useEffect, useState, useRef } from "react";
import {
  Copy,
  Download,
  Upload
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "../lib/supabase";
import Toast from "../components/Toast";
import { useTranslation } from "react-i18next";


export default function ExternalDeposit() {

  const { t } = useTranslation();

  const [openCoin, setOpenCoin] = useState(false);
  const [openNetwork, setOpenNetwork] = useState(false);
  

  const coinRef = useRef(null);
const networkRef = useRef(null);

  const [wallets, setWallets] =
    useState([]);

  const [coin, setCoin] =
    useState("");

  const [network, setNetwork] =
    useState("");

  const [slip, setSlip] =
    useState(null);

  const [amount, setAmount] =
    useState("");

  const [showToast, setShowToast] =
    useState(false);

  const [toastMsg, setToastMsg] =
    useState("");

    const COIN_LOGO = {
  USDT: "/coins/usdt.png",
  BTC: "/coins/btc.png",
  ETH: "/coins/eth.png",
  BNB: "/coins/bnb.png",
  SOL: "/coins/sol.png",
  XRP: "/coins/xrp.png",
  DOGE: "/coins/doge.png",
  TRX: "/coins/trx.png",
  TON: "/coins/ton.png",
  AVAX: "/coins/avax.png",
  LINK: "/coins/link.png",
  LTC: "/coins/ltc.png",
  ADA: "/coins/ada.png",
  DOT: "/coins/dot.png",
  BCH: "/coins/bch.png",
  FIL: "/coins/fil.png",
  NEAR: "/coins/near.png",
  ATOM: "/coins/atom.png",
  APT: "/coins/apt.png",
  OP: "/coins/op.png",
  ARB: "/coins/arb.png",
  MATIC: "/coins/matic.png",
  SUI: "/coins/sui.png"
};

const NETWORK_LOGO = {
  TRC20: "/coins/trx.png",
  ERC20: "/coins/eth.png",
  BEP20: "/coins/bnb.png",
  BEP2: "/coins/bnb.png",
  POLYGON: "/coins/matic.png",
  SOL: "/coins/sol.png"
};

  useEffect(() => {
    loadWallets();
  }, []);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (coinRef.current && !coinRef.current.contains(e.target)) {
      setOpenCoin(false);
    }

    if (networkRef.current && !networkRef.current.contains(e.target)) {
      setOpenNetwork(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, []);

  const notify = (msg) => {

    setToastMsg(msg);

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2500);

  };

  const loadWallets = async () => {

    const { data } =
      await supabase
        .from("deposit_wallets")
        .select("*")
        .order("id");

    if (data?.length > 0) {

      setWallets(data);

      setCoin(data[0].coin);

      setNetwork(data[0].network);

    }
  };

  const currentWallet =
    wallets.find(
      item =>
        item.coin === coin &&
        item.network === network
    );

    console.log("wallets =", wallets);
    console.log("currentWallet =", currentWallet);
    console.log("address =", currentWallet?.address);

  const copyAddress = () => {

    if (!currentWallet) return;

    navigator.clipboard.writeText(
      currentWallet.address
    );

    notify(t("walletCopied"));
  };

  const saveQR = () => {

    const canvas =
      document.querySelector(
        ".external-qr canvas"
      );

    if (!canvas) return;

    const link =
      document.createElement("a");

    link.href =
      canvas.toDataURL(
        "image/png"
      );

    link.download =
      `${coin}-${network}.png`;

    link.click();

    notify(t("qrSaved"));
  };

  const submitDeposit = async () => {

  if (!slip) {
    notify(t("pleaseUploadSlip"));
    return;
  }

  if(!amount || Number(amount) <= 0){

  notify(t("enterAmount"));

  return;

}

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  if (!user) {
    notify(t("pleaseLogin"));
    return;
  }

  const fileName =
  `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.png`;

  const { error: uploadError } =
    await supabase.storage
      .from("deposit-slips")
      .upload(
        fileName,
        slip
      );

 if (uploadError) {

  console.log("UPLOAD ERROR =", uploadError);

  alert(
    JSON.stringify(uploadError)
  );

  notify(t("uploadFailed"));

  return;
}

  const {
    data: publicData
  } =
    supabase.storage
      .from("deposit-slips")
      .getPublicUrl(
        fileName
      );

  const slipUrl =
    publicData.publicUrl;

  const { error } =
    await supabase
  .from("deposits")
  .insert([
{
 user_id: user.id,
 coin: coin,
 network: network,

 amount: Number(amount),

 wallet_address: currentWallet.address,
 slip: slip.name,
 slip_url: slipUrl,
 status:"pending"
}
]);

  if (error) {

  console.log("DEPOSIT ERROR =", error);

  alert(
    JSON.stringify(error)
  );

  notify(t("saveFailed"));

  return;

}

  notify(t("depositSubmitted"));

};

  return (
    <>

      <div className="deposit-card">
  <h3>{t("crypto")}</h3>

  <div className="custom-select" ref={coinRef}>
    <div
      className="select-box"
      onClick={() => setOpenCoin(!openCoin)}
    >
      <div className="select-value">
        <img src={COIN_LOGO[coin]} className="select-logo" />
        <span>{coin}</span>
      </div>

      <span>▼</span>
    </div>

    {openCoin && (
      <div className="select-menu">
        {[...new Set(wallets.map(w => w.coin))].map((c) => (
          <div
            key={c}
            className="select-item"
            onClick={() => {
              setCoin(c);

              const list = wallets.filter(w => w.coin === c);
              const trc20 = list.find(w => w.network === "TRC20");

              setNetwork(trc20 ? "TRC20" : list[0]?.network || "");

              setOpenCoin(false);
            }}
          >
            <img src={COIN_LOGO[c]} className="select-logo" />
            <span>{c}</span>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

      <div className="deposit-card">
  <h3>{t("network")}</h3>

  <div className="custom-select" ref={networkRef}>
    <div
      className="select-box"
      onClick={() => setOpenNetwork(!openNetwork)}
    >
      <div className="select-value">
        <img
          src={NETWORK_LOGO[network] || "/coins/default.png"}
          className="select-logo"
        />
        <span>{network}</span>
      </div>

      <span>▼</span>
    </div>

    {openNetwork && (
      <div className="select-menu">
        {[...new Set(
          wallets
            .filter(w => w.coin === coin)
            .map(w => w.network)
        )].map((n) => (
          <div
            key={n}
            className="select-item"
            onClick={() => {
              setNetwork(n);
              setOpenNetwork(false);
            }}
          >
            <img src={NETWORK_LOGO[n]} className="select-logo" />
            <span>{n}</span>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

      {currentWallet && (

        <div className="deposit-card">

          <h3>{t("qrCode")}</h3>

          <div
            className="external-qr"
            style={{
              display: "flex",
              justifyContent:
                "center",
              marginBottom:
                "20px"
            }}
          >

            <QRCodeCanvas
              value={currentWallet.address}
              size={220}
            />

          </div>

          <p
  style={{
    color:"#aaa",
    marginBottom:"10px"
  }}
>
  {t("depositAddress")}
</p>

          <div
  className="address-box"
  onClick={copyAddress}
>
  <span className="address-text">
    {currentWallet?.address}
  </span>
</div>

          <div
            style={{
              display:"flex",
              gap:"10px",
              marginTop:"15px"
            }}
          >

            <button
              className="copy-btn"
              onClick={
                copyAddress
              }
            >
              <Copy size={18}/>
{t("copy")}
            </button>

            <button
              className="copy-btn"
              onClick={
                saveQR
              }
            >
              <Download size={18}/>
{t("saveQR")}
            </button>

          </div>

        </div>

      )}

      <div className="deposit-card">

  <h3>{t("amount")}</h3>

  <input
    type="number"
    placeholder="Enter amount"
    value={amount}
    onChange={(e)=>
      setAmount(e.target.value)
    }
  />

</div>


<div className="deposit-card">

  <h3>{t("uploadSlip")}</h3>

        <label
          className="upload-box"
        >

          <Upload size={40}/>

          <p>
            {
              slip
              ? slip.name
              : t("selectSlip")
            }
          </p>

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) =>
              setSlip(
                e.target.files[0]
              )
            }
          />

        </label>

      </div>

      <button
        className="submit-btn"
        onClick={
          submitDeposit
        }
      >
        {t("submitDeposit")}
      </button>

      <Toast
        show={showToast}
        message={toastMsg}
      />

    </>
  );
}