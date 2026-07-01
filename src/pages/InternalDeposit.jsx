
import { useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "../lib/supabase";
import { useToast } from "../context/ToastContext";

export default function InternalDeposit() {

  const [wallets, setWallets] = useState([]);
  const [coin, setCoin] = useState("");
  const [network, setNetwork] = useState("");
  const { showToast } = useToast();
  

  useEffect(() => {
    loadWallets();
  }, []);

  

  const loadWallets = async () => {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const { data, error } =
    await supabase
      .from("user_wallets")
      .select("*")
      .eq(
        "user_id",
        user.id
      );

    
    console.log("USER =", user);
console.log("DATA =", data);
console.log("ERROR =", error);


  console.log(data);

  if (data?.length > 0) {

    setWallets(data);

    const usdtWallet =
  data.find(
    x => x.coin === "USDT"
  );

if(usdtWallet){

  setCoin(
    usdtWallet.coin
  );

  setNetwork(
    usdtWallet.network
  );

}else{

  setCoin(data[0].coin);

  setNetwork(
    data[0].network
  );

}

  }

};

  const currentWallet =
    wallets.find(
      item =>
        item.coin === coin &&
        item.network === network
    );

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

        <h3>เลือกเหรียญ</h3>

        <select
          value={coin}
          onChange={handleCoinChange}
        >

          {[
  ...new Set(
    wallets.map(
      item => item.coin
    )
  )
]
.sort((a,b)=>{

  const priority = [
    "USDT",
    "BTC",
    "ETH"
  ];

  const aIndex =
    priority.indexOf(a);

  const bIndex =
    priority.indexOf(b);

  if(
    aIndex !== -1 &&
    bIndex !== -1
  ){
    return aIndex - bIndex;
  }

  if(aIndex !== -1) return -1;
  if(bIndex !== -1) return 1;

  return a.localeCompare(b);

})
.map((item) => (

            <option
              key={item}
              value={item}
            >
              {item}
            </option>

          ))}

        </select>

      </div>

      <div className="deposit-card">

        <h3>Network</h3>

        <select
          value={network}
          onChange={(e) =>
            setNetwork(
              e.target.value
            )
          }
        >

          {wallets
            .filter(
              item =>
                item.coin === coin
            )
            .map((item) => (

              <option
                key={item.id}
                value={item.network}
              >
                {item.network}
              </option>

            ))}

        </select>

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

          <div className="address-box">
            {currentWallet.address}
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
