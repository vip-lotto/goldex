import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import "../styles/Transfer.css";
import Toast from "../components/Toast";
import { useTranslation } from "react-i18next";


export default function Transfer() {
    const navigate = useNavigate();

    const { t } = useTranslation();

  const [wallets, setWallets] = useState([]);

  const [coin, setCoin] = useState("");
  const [network, setNetwork] = useState("");

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const [qrFile, setQrFile] = useState(null);
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

    const user =
  JSON.parse(
    localStorage.getItem("user")
  );

const { data } =
  await supabase
    .from("user_wallets")
    .select("*")
    .eq(
      "user_id",
      user.id
    );

    if (data?.length > 0) {

  setWallets(data);

  const usdt =
    data.find(
      item =>
        item.coin === "USDT"
    );

  if(usdt){

    setCoin(
      usdt.coin
    );

    setNetwork(
      usdt.network
    );

  }else{

    setCoin(
      data[0].coin
    );

    setNetwork(
      data[0].network
    );

  }

}
  };

  const handleCoinChange = (e) => {

    const value =
      e.target.value;

    setCoin(value);

    const firstNetwork =
      wallets.find(
        item =>
          item.coin === value
      )?.network || "";

    setNetwork(firstNetwork);
  };

  const transferMoney =
    async () => {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (!address) {

  notify(t("enterDepositAddress"));
  return;
}

    if (!amount) {

      notify(t("enterAmount"));

      return;
    }

    const { data: senderWallet } =
      await supabase
        .from("wallets")
        .select("*")
        .eq(
          "user_id",
          user.id
        )
        .single();

    if (!senderWallet) {

  notify(t("senderWalletNotFound"));

  return;
}
    if (
  Number(amount) < 1
) {

  notify(t("minimumTransfer"));

  return;
}


    if (
      Number(senderWallet.balance)
      <
      Number(amount)
    ) {

      notify(t("insufficientBalance"));

      return;
    }

    let receiverAddress = null;

if (address.trim()) {

  const { data } =
    await supabase
      .from("user_wallets")
      .select("*")
      .eq("address", address)
      .eq("coin", coin)
      .eq("network", network)
      .single();

  receiverAddress = data;

  console.log("DATA =", data);

}

    console.log(
  "ADDRESS =",
  address
);

console.log(
  "COIN =",
  coin
);

console.log(
  "NETWORK =",
  network
);

console.log(
  "RECEIVER =",
  receiverAddress
);


    if (!receiverAddress) {

  notify(t("invalidAddress"));

  return;
}

    const receiverId =
      receiverAddress.user_id;

    if (
      Number(receiverId) ===
      Number(user.id)
    ) {

      notify(t("cannotTransferSelf"));
      return;
    }

    const { data: receiverWallet } =
      await supabase
        .from("wallets")
        .select("*")
        .eq(
          "user_id",
          receiverId
        )
        .single();

    if (!receiverWallet) {

  notify(t("receiverWalletNotFound"));

  return;
}

    await supabase
      .from("wallets")
      .update({

        balance:
          Number(
            senderWallet.balance
          ) -
          Number(amount)

      })
      .eq(
        "user_id",
        user.id
      );

    await supabase
      .from("wallets")
      .update({

        balance:
          Number(
            receiverWallet.balance
          ) +
          Number(amount)

      })
      .eq(
        "user_id",
        receiverId
      );

    await supabase
      .from("transfers")
      .insert({

        sender_id:
          user.id,

        receiver_id:
          receiverId,

        amount:
          Number(amount),

        coin,

        network,

        status:
          "success"

      });


      await supabase
.from("notifications")
.insert({

  user_id: receiverId,

  title: t("transferReceived"),

  message:
`${t("received")} ${amount} ${coin}

${t("network")} : ${network}

${t("fromMember")} ID ${user.id}`,

  is_read: false

});


    await supabase
.from("notifications")
.insert({

  user_id: user.id,

  title: t("transferCompleted"),

  message:
`${t("transferred")} ${amount} ${coin}

${t("network")} : ${network}

${t("toAddress")}

${address}`,

  is_read: false

});

    notify(t("transferSuccess"));

    setAddress("");
    setAmount("");
    setQrFile(null);
  };

  return (

<>

<div className="transfer-page">

    <div
  style={{
    display:"flex",
    alignItems:"center",
    gap:"12px",
    marginBottom:"20px"
  }}
>

  <ArrowLeft
    size={28}
    style={{
      cursor:"pointer",
      color:"#facc15"
    }}
    onClick={() =>
      navigate("/home")
    }
  />

  <h2
    className="transfer-title"
    style={{
      margin:0
    }}
  >
    {t("transfer")}
  </h2>

</div>

    <div className="transfer-card">

      <h3>{t("coin")}</h3>

      <select
        className="transfer-select"
        value={coin}
        onChange={handleCoinChange}
      >

        {[...new Set(
  wallets.map(
    x => x.coin
  )
)]
.sort((a,b)=>{

  const priority = [
    "USDT",
    "BTC",
    "ETH",
    "BNB",
    "SOL",
    "XRP",
    "DOGE"
  ];

  const aIndex =
    priority.indexOf(a);

  const bIndex =
    priority.indexOf(b);

  if(aIndex === -1 && bIndex === -1){
    return a.localeCompare(b);
  }

  if(aIndex === -1) return 1;
  if(bIndex === -1) return -1;

  return aIndex - bIndex;

})

        .map(item => (

          <option
            key={item}
            value={item}
          >
            {item}
          </option>

        ))}

      </select>

    </div>

    <div className="transfer-card">

      <h3>{t("network")}</h3>

      <select
        className="transfer-select"
        value={network}
        onChange={(e)=>
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
          .map(item => (

            <option
              key={item.id}
              value={item.network}
            >
              {item.network}
            </option>

          ))}

      </select>

    </div>

    <div className="transfer-card">

      <h3>{t("depositAddress")}</h3>

      <input
        className="transfer-input"
        placeholder={t("walletAddress")}
        value={address}
        onChange={(e)=>
          setAddress(
            e.target.value
          )
        }
      />

    </div>

    <div className="transfer-card">

      <h3>{t("scanQR")}</h3>

      <label
        className="transfer-upload"
      >

        <Upload />

        <p>
          {
            qrFile
            ? qrFile.name
            : t("tapToScan")
          }
        </p>

        <input
          hidden
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e)=>
            setQrFile(
              e.target.files[0]
            )
          }
        />

      </label>

    </div>

    <div className="transfer-card">

      
        <h3>{t("amount")}</h3>
      

      <input
        type="number"
        className="transfer-input"
        placeholder="0.00"
        value={amount}
        onChange={(e)=>
          setAmount(
            e.target.value
          )
        }
      />

    </div>

    <div className="transfer-btns">

      <button
        className="transfer-confirm"
        onClick={transferMoney}
      >
        {t("confirm")}
      </button>

      <button
        className="transfer-cancel"
        onClick={()=>{
          setAddress("");
          setAmount("");
          setQrFile(null);
        }}
      >
        {t("cancel")}
      </button>

    </div>

  </div>

<Toast
  show={showToast}
  message={toastMsg}
/>

</>

);
}