import { useEffect, useState } from "react";
import {
  Copy,
  Download,
  Upload
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "../lib/supabase";
import Toast from "../components/Toast";

export default function ExternalDeposit() {

  const [wallets, setWallets] =
    useState([]);

  const [coin, setCoin] =
    useState("");

  const [network, setNetwork] =
    useState("");

  const [slip, setSlip] =
    useState(null);

  const [showToast, setShowToast] =
    useState(false);

  const [toastMsg, setToastMsg] =
    useState("");

  useEffect(() => {
    loadWallets();
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

  const copyAddress = () => {

    if (!currentWallet) return;

    navigator.clipboard.writeText(
      currentWallet.address
    );

    notify("คัดลอกที่อยู่กระเป๋าแล้ว");
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

    notify("บันทึก QR สำเร็จ");
  };

  const submitDeposit = async () => {

  if (!slip) {
    notify("กรุณาแนบสลิป");
    return;
  }

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  if (!user) {
    notify("กรุณาเข้าสู่ระบบ");
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

  notify("อัปโหลดสลิปไม่สำเร็จ");

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
      wallet_address:
        currentWallet.address,
      slip: slip.name,
      slip_url: slipUrl,
      status: "pending"
    }
  ]);

  if (error) {

  console.log("DEPOSIT ERROR =", error);

  alert(
    JSON.stringify(error)
  );

  notify(
    "บันทึกข้อมูลไม่สำเร็จ"
  );

  return;

}

  notify(
    "ส่งคำขอฝากสำเร็จ"
  );

};

  return (
    <>

      <div className="deposit-card">

        <h3>
          เลือกเหรียญ
        </h3>

        <select
          value={coin}
          onChange={(e) => {

            const value =
              e.target.value;

            setCoin(value);

            const firstNetwork =
              wallets.find(
                x =>
                  x.coin ===
                  value
              )?.network || "";

            setNetwork(
              firstNetwork
            );
          }}
        >

          {[...new Set(
            wallets.map(
              x => x.coin
            )
          )].map((item) => (

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

        <h3>
          Network
        </h3>

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
              x =>
                x.coin === coin
            )
            .map((item) => (

              <option
                key={
                  item.id
                }
                value={
                  item.network
                }
              >
                {item.network}
              </option>

            ))}

        </select>

      </div>

      {currentWallet && (

        <div className="deposit-card">

          <h3>
            QR Code
          </h3>

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
              value={
                currentWallet.address
              }
              size={220}
            />

          </div>

          <p>
            Deposit Address
          </p>

          <div
            className="address-box"
          >
            {
              currentWallet.address
            }
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
              คัดลอก
            </button>

            <button
              className="copy-btn"
              onClick={
                saveQR
              }
            >
              <Download size={18}/>
              บันทึก QR
            </button>

          </div>

        </div>

      )}

      <div className="deposit-card">

        <h3>
          แนบสลิป
        </h3>

        <label
          className="upload-box"
        >

          <Upload size={40}/>

          <p>
            {
              slip
              ? slip.name
              : "เลือกสลิป"
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
        ส่งคำขอฝาก
      </button>

      <Toast
        show={showToast}
        message={toastMsg}
      />

    </>
  );
}