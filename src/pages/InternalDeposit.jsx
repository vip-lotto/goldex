
import { useEffect, useState, useRef } from "react";
import { Copy, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "../lib/supabase";
import { useToast } from "../context/ToastContext";

export default function InternalDeposit() {

  const [wallets, setWallets] = useState([]);
  const [coin, setCoin] = useState("");
  const [network, setNetwork] = useState("");
  const [showCoinMenu, setShowCoinMenu] = useState(false);
const [showNetworkMenu, setShowNetworkMenu] = useState(false);

const coinRef = useRef(null);
const networkRef = useRef(null);

  const { showToast } = useToast();

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

  function handleClickOutside(e){

    if(
      coinRef.current &&
      !coinRef.current.contains(e.target)
    ){
      setShowCoinMenu(false);
    }

    if(
      networkRef.current &&
      !networkRef.current.contains(e.target)
    ){
      setShowNetworkMenu(false);
    }

  }

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {

    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

  };

}, []);

  

  const loadWallets = async () => {

  const user = JSON.parse(localStorage.getItem("user"));

  const { data, error } = await supabase
    .from("user_wallets")
    .select("*")
    .eq("user_id", user.id);

  console.log("DATA =", data);

  if (!data || data.length === 0) return;

  setWallets(data);

  // 👉 default USDT
  const usdtWallet = data.find(x => x.coin === "USDT");

  // 👉 force TRC20 first
  const trc20Wallet = data.find(
    x => x.coin === "USDT" && x.network === "TRC20"
  );

  if (usdtWallet) {

    setCoin("USDT");

    if (trc20Wallet) {
      setNetwork("TRC20");
    } else {
      setNetwork(usdtWallet.network);
    }

  } else {

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

    const coinList = [
  ...new Set(wallets.map(item => item.coin))
].sort((a, b) => {

  const priority = ["USDT", "BTC", "ETH"];

  const ai = priority.indexOf(a);
  const bi = priority.indexOf(b);

  if (ai !== -1 && bi !== -1) return ai - bi;
  if (ai !== -1) return -1;
  if (bi !== -1) return 1;

  return a.localeCompare(b);

});

const networkPriority = [
  "TRC20",
  "ERC20",
  "BEP20",
  "BEP2",
  "POLYGON",
  "SOL"
];

const networkList = wallets
  .filter(item => item.coin === coin)
  .sort((a, b) => {

    const ai = networkPriority.indexOf(a.network);
    const bi = networkPriority.indexOf(b.network);

    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;

    return a.network.localeCompare(b.network);
  });

  const copyAddress = () => {

    if (!currentWallet) return;

    navigator.clipboard.writeText(
      currentWallet.address
    );

    showToast(
  "คัดลอกที่อยู่กระเป๋าแล้ว",
  "success"
);
  };

  const saveQR = () => {

    const canvas =
      document.querySelector(
        ".internal-qr canvas"
      );

    if (!canvas) return;

    const url =
      canvas.toDataURL("image/png");

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${coin}-${network}.png`;

    link.click();

    showToast(
  "บันทึก QR สำเร็จ",
  "success"
);
  };

  const handleCoinChange = (e) => {

    const selectedCoin =
      e.target.value;

    setCoin(selectedCoin);

    const firstNetwork =
      wallets.find(
        item =>
          item.coin === selectedCoin
      )?.network || "";

    setNetwork(firstNetwork);
  };

  return (

    <>

      <div className="deposit-card">

    <h3>Crypto</h3>

    <div
        className="custom-select"
        ref={coinRef}
    >

        <div
            className="select-box"
            onClick={() =>
                setShowCoinMenu(!showCoinMenu)
            }
        >

            <div className="select-value">

                <img
                    src={COIN_LOGO[coin]}
                    className="select-logo"
                    alt=""
                />

                <span>{coin}</span>

            </div>

            <span>▼</span>

        </div>

        {showCoinMenu && (

            <div className="select-menu">

                {coinList.map((item)=>(

                    <div
                        key={item}
                        className="select-item"
                        onClick={() => {

                            setCoin(item);

                            const first =
                                wallets.find(
                                    x => x.coin === item
                                );

                            setNetwork(first.network);

                            setShowCoinMenu(false);

                        }}
                    >

                        <img
                            src={COIN_LOGO[item]}
                            className="select-logo"
                            alt=""
                        />

                        <span>{item}</span>

                    </div>

                ))}

            </div>

        )}

    </div>

</div>

      <div className="deposit-card">

    <h3>Network</h3>

    <div
        className="custom-select"
        ref={networkRef}
    >

        <div
            className="select-box"
            onClick={() =>
                setShowNetworkMenu(!showNetworkMenu)
            }
        >

            <div className="select-value">

                <img
                    src={NETWORK_LOGO[network]}
                    className="select-logo"
                    alt=""
                />

                <span>{network}</span>

            </div>

            <span>▼</span>

        </div>

        {showNetworkMenu && (

            <div className="select-menu">

                {networkList.map((item) => (

                    <div
                        key={item.id}
                        className="select-item"
                        onClick={() => {

                            setNetwork(item.network);
                            setShowNetworkMenu(false);

                        }}
                    >

                        <img
                            src={NETWORK_LOGO[item.network] || COIN_LOGO[item.coin]}
                            className="select-logo"
                            alt=""
                        />

                        <span>{item.network}</span>

                    </div>

                ))}

            </div>

        )}

    </div>

</div>

      {currentWallet && (

        <div className="deposit-card">

          <h3>QR Code</h3>

          <div
            className="internal-qr"
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px"
            }}
          >

            <QRCodeCanvas
              value={
                currentWallet.address
              }
              size={220}
            />

          </div>

          <p
            style={{
              color: "#aaa",
              marginBottom: "10px"
            }}
          >
            Deposit Address
          </p>

          <div className="address-box" onClick={copyAddress}>
  <span className="address-text">
    {currentWallet?.address}
  </span>
</div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px"
            }}
          >

            <button
              className="copy-btn"
              onClick={copyAddress}
            >
              <Copy size={18}/>
              คัดลอก
            </button>

            <button
              className="copy-btn"
              onClick={saveQR}
            >
              <Download size={18}/>
              บันทึก QR
            </button>

          </div>

        </div>

      )}

      <div className="deposit-note">

        <p>
          ⚠️ Please double-check the Bitcoin and network details before transferring.
        </p>

        <p>
          ℹ️ Please fill in the correct information.
        </p>

      </div>

      

    </>

  );
}
