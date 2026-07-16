import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useToast } from "../context/ToastContext";
import { addTransaction } from "../lib/transactionApi";
import { useTranslation } from "react-i18next";


const COIN_LOGO = {
  USDT:"/coins/usdt.png",
  BTC:"/coins/btc.png",
  ETH:"/coins/eth.png",
  BNB:"/coins/bnb.png",
  SOL:"/coins/sol.png",
  XRP:"/coins/xrp.png",
  DOGE:"/coins/doge.png",
  ADA:"/coins/ada.png",
  TRX:"/coins/trx.png",
  TON:"/coins/ton.png",
  AVAX:"/coins/avax.png",
  LINK:"/coins/link.png",
  LTC:"/coins/ltc.png",
  BCH:"/coins/bch.png",
  DOT:"/coins/dot.png",
  ETC:"/coins/etc.png",
  FIL:"/coins/fil.png",
  NEAR:"/coins/near.png",
  ATOM:"/coins/atom.png",
  APT:"/coins/apt.png",
  ARB:"/coins/arb.png",
  OP:"/coins/op.png",
  MATIC:"/coins/matic.png",
  SUI:"/coins/sui.png",
};

const NETWORK_LOGO = {
  TRC20:"/coins/trx.png",
  ERC20:"/coins/eth.png",
  BEP20:"/coins/bnb.png",
  BEP2:"/coins/bnb.png",
  POLYGON:"/coins/matic.png",
  SOL:"/coins/sol.png",
};


export default function InternalWithdraw() {

  const [wallets, setWallets] = useState([]);

  const [coin, setCoin] = useState("");
  const [network, setNetwork] = useState("");

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const [qrFile, setQrFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [hasPendingWithdraw, setHasPendingWithdraw] = useState(false);

  const [openCoin,setOpenCoin]=useState(false);
const [openNetwork,setOpenNetwork]=useState(false);

  const { showToast } = useToast();

  const { t } = useTranslation();

  

  let fee = 0;

if (coin === "USDT") {
  fee = 1;
}

const receiveAmount =
Math.max(
  Number(amount || 0) - fee,
  0
);

  
  const currentWallet =
  wallets.find(
    item =>
      item.coin === coin &&
      item.network === network
  );

  
  

  useEffect(() => {

    loadWallets();

    checkPendingWithdraw();

    const timer = setInterval(() => {
        checkPendingWithdraw();
    }, 3000);

    return () => clearInterval(timer);

}, []);

  const loadWallets = async () => {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const { data } =
    await supabase
      .from("wallets")
      .select("*")
      .eq(
        "user_id",
        user.id
      );


const { data: walletNetworks } =
    await supabase
      .from("user_wallets")
      .select("*")
      .eq(
        "user_id",
        user.id
      );

  if (data?.length > 0 && walletNetworks?.length > 0) {

    setWallets(
  walletNetworks.map(item => {

    const balanceWallet =
      data[0] || {};

    return {
      ...item,
      balance: balanceWallet.balance,
      BTC: balanceWallet.BTC,
      ETH: balanceWallet.ETH,
      BNB: balanceWallet.BNB,
      TRX: balanceWallet.TRX,
      ADA: balanceWallet.ADA
    };

  })
);

    const usdtNetworks = walletNetworks.filter(
  item => item.coin === "USDT"
);

const trc20 = usdtNetworks.find(
  item =>
    item.network
      .replace("-", "")
      .toUpperCase() === "TRC20"
);

if (usdtNetworks.length > 0) {

  setCoin("USDT");

  setNetwork(
    trc20
      ? trc20.network
      : usdtNetworks[0].network
  );

} else {

  setCoin(walletNetworks[0].coin);

  const firstNetworks = walletNetworks.filter(
  item => item.coin === walletNetworks[0].coin
);

  const trc = firstNetworks.find(
    item =>
      item.network
        .replace("-", "")
        .toUpperCase() === "TRC20"
  );

  setNetwork(
    trc
      ? trc.network
      : firstNetworks[0].network
  );

}

  }

};

const checkPendingWithdraw = async () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) return;

    const { data } = await supabase
        .from("withdrawals")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .limit(1);

    const hasPending =
    data && data.length > 0;

setHasPendingWithdraw(hasPending);





};

  const handleCoinChange = (e) => {

    const value =
      e.target.value;

    setCoin(value);

    const networks = wallets.filter(
  item => item.coin === value
);

console.log(networks);

const trc20 = networks.find(
  item =>
    item.network.replace("-", "").toUpperCase() === "TRC20"
);

setNetwork(
  trc20
    ? trc20.network
    : networks[0]?.network || ""
);
  };

  const submitWithdraw =
    async () => {

      if (loading) return;

      if (hasPendingWithdraw) {

  showToast(
     t("submitting"),
    "warning"
  );

  return;

}

setLoading(true);

    const user =
  JSON.parse(
    localStorage.getItem("user")
  );

// โหลดข้อมูลสมาชิก
const { data: profile } = await supabase
  .from("profiles")
  .select("member_id, first_name, last_name")
  .eq("id", user.id)
  .single();

console.log("USER =", user);
console.log("PROFILE =", profile);


      const {
  data: pendingWithdraw
} = await supabase
  .from("withdrawals")
  .select("id")
  .eq("user_id", user.id)
  .in(
    "status",
    ["pending", "processing"]
  );

if (
  pendingWithdraw &&
  pendingWithdraw.length > 0
) {

  showToast(
  t("pendingWithdraw"),
  "warning"
);
setLoading(false);
  return;
}

    const currentWallet = wallets.find(
  item =>
    item.coin === coin &&
    item.network === network
);

console.log("Wallets =", wallets);
console.log("Selected Coin =", coin);
console.log("Selected Network =", network);
console.log("Current Wallet =", currentWallet);

if (!currentWallet) {

  showToast(
    "Wallet not found",
    "error"
  );

  setLoading(false);

  return;
}

let currentBalance = 0;

switch (coin) {

  case "USDT":
    currentBalance = Number(currentWallet.balance || 0);
    break;

  case "BTC":
    currentBalance = Number(currentWallet.BTC || 0);
    break;

  case "ETH":
    currentBalance = Number(currentWallet.ETH || 0);
    break;

  case "BNB":
    currentBalance = Number(currentWallet.BNB || 0);
    break;

  case "TRX":
    currentBalance = Number(currentWallet.TRX || 0);
    break;

  case "ADA":
    currentBalance = Number(currentWallet.ADA || 0);
    break;

  default:
    currentBalance = 0;
}

  console.log("Balance =", currentBalance);
console.log("Withdraw =", amount);

if (Number(amount) > currentBalance) {

  showToast(
    "Insufficient funds.",
    "error"
  );

  setLoading(false);

  return;
}

    if (!amount) {
      showToast(
  t("enterAmount"),
  "warning"
);

setLoading(false);
      return;
    }

    if (!address && !qrFile) {
  showToast(
  t("enterAddress"),
  "warning"
);
setLoading(false);
  return;
}
    if (Number(amount) <= 0) {

  showToast(
    t("minimumWithdraw"),
    "warning"
  );

  setLoading(false);

  return;
}

    

    

    let qrUrl = "";

if (qrFile) {

  const fileName = `${Date.now()}-${qrFile.name}`;

  const { data: sessionData } = await supabase.auth.getSession();

console.log("SESSION =", sessionData.session);
console.log("USER =", sessionData.session?.user);
console.log("ROLE =", sessionData.session?.user?.role);
console.log("USER ID =", sessionData.session?.user?.id);

  const { data: uploadData, error: uploadError } =
await supabase.storage
    .from("withdraw-qr")
    .upload(fileName, qrFile);

    console.log("UPLOAD DATA =", uploadData);
console.log("UPLOAD ERROR =", uploadError);

  if (uploadError) {

  console.log(uploadError);

  alert(uploadError.message);

  showToast(uploadError.message, "error");

  setLoading(false);

  return;
}

  const { data } = supabase.storage
    .from("withdraw-qr")
    .getPublicUrl(fileName);

  qrUrl = data.publicUrl;
}

    

    const { data, error } =
  await supabase
.from("withdrawals")
.insert({

    user_id:
      user.id,

    member_id:
      profile?.member_id,

    first_name:
      profile?.first_name,

    last_name:
      profile?.last_name,

    type:
      "crypto",

    coin,

    network,

    address,

    amount:
      Number(amount),

    fee,

    receive_amount:
coin === "USDT"
?
Number(amount) - fee
:
Number(amount),

    qr_image:
      qrUrl,

    status:
      "pending"

})

    .select();

    console.log("WITHDRAW DATA =", data);
    console.log("WITHDRAW ERROR =", error);

console.log(
  "INSERT DATA =",
  data
);

console.log(
  "INSERT ERROR =",
  error
);

    if (error) {

  console.error("WITHDRAW INSERT ERROR:", error);

  alert(JSON.stringify(error));

  showToast(
    error.message,
    "error"
  );

  setLoading(false);

  return;
}

    

try {
  await addTransaction({
    user_id: user.id,
    type: "withdraw",
    amount: Number(amount),
    status: "pending",
    description: `ถอน ${amount} ${coin}`
  });
} catch (e) {
  console.error("TRANSACTION ERROR", e);
}

    

    showToast(
t("withdrawSubmitted"),
"success"
);

setHasPendingWithdraw(true);

setLoading(false);

setAddress("");
setAmount("");
setQrFile(null);

};

return (

    <>

      <div className="deposit-card">

        <h3>{t("crypto")}</h3>

        <div
  className="custom-select"
  onClick={() => setOpenCoin(!openCoin)}
>

  <div className="selected-item">

    <img
      src={COIN_LOGO[coin]}
      className="coin-icon"
      alt=""
    />

    <span>{coin}</span>

  </div>

  <span>▼</span>

</div>

{openCoin && (

<div className="dropdown-menu">

{[
  ...new Set(wallets.map(item => item.coin))
]
.sort((a,b)=>{

  const priority=[
    "USDT",
    "BTC",
    "ETH",
    "BNB",
    "SOL",
    "XRP",
    "DOGE"
  ];

  const ai=priority.indexOf(a);
  const bi=priority.indexOf(b);

  if(ai===-1&&bi===-1)
    return a.localeCompare(b);

  if(ai===-1) return 1;
  if(bi===-1) return -1;

  return ai-bi;

})
.map(item=>(

<div
key={item}
className="dropdown-item"
onClick={() => {

setCoin(item);

const networks = wallets.filter(
  w => w.coin === item
);

const trc20 = networks.find(
  w =>
    w.network
      .replace("-", "")
      .toUpperCase() === "TRC20"
);

setNetwork(
  trc20
    ? trc20.network
    : networks[0]?.network || ""
);

setOpenCoin(false);

}}
>

<img
src={COIN_LOGO[item]}
className="coin-icon"
alt=""
/>

{item}

</div>

))}

</div>

)}

      </div>

      <div className="deposit-card">

        <h3>{t("network")}</h3>

        <div
className="custom-select"
onClick={()=>setOpenNetwork(!openNetwork)}
>

<div className="selected-item">

<img
src={NETWORK_LOGO[network]}
className="coin-icon"
alt=""
/>

<span>{network}</span>

</div>

<span>▼</span>

</div>

{openNetwork && (

  <div className="dropdown-menu">

    {wallets
      .filter((w) => w.coin === coin)
      .sort((a, b) => {

        const priority = [
          "TRC20",
          "ERC20",
          "BEP20",
          "BEP2",
          "POLYGON",
          "SOL",
        ];

        const an = a.network.replace("-", "").toUpperCase();
const bn = b.network.replace("-", "").toUpperCase();

const aIndex = priority.indexOf(an);
const bIndex = priority.indexOf(bn);

        if (aIndex === -1 && bIndex === -1) {
          return a.network.localeCompare(b.network);
        }

        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;

        return aIndex - bIndex;

      })
      .map((item) => (

        <div
          key={item.id}
          className="dropdown-item"
          onClick={() => {
            setNetwork(item.network);
            setOpenNetwork(false);
          }}
        >
          <img
            src={NETWORK_LOGO[item.network]}
            className="coin-icon"
            alt=""
          />
          {item.network}
        </div>

      ))}

  </div>

)}

      </div>

      <div className="deposit-card">

        <h3>{t("address")}</h3>

        <input
          value={address}
          onChange={(e) =>
            setAddress(
              e.target.value
            )
          }
          placeholder={t("walletAddress")}
          className="deposit-input"
        />

      </div>

      <div className="deposit-card">

        <h3>{t("walletQRCode")}</h3>

        <label
          className="upload-box"
        >

          <Upload size={40} />

          <p>
            {
              qrFile
              ? qrFile.name
              : t("walletQRCode")
            }
          </p>

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) =>
              setQrFile(
                e.target.files[0]
              )
            }
          />

        </label>

      </div>

      <div className="deposit-card">

        <h3>{t("amount")}</h3>

        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
          placeholder="0.00"
          className="deposit-input"
        />

      </div>

      <div className="deposit-card">

        <p>
{t("transferFee")} :
{fee} {coin}
</p>

<p>
{t("amountReceived")} :
{receiveAmount > 0
? receiveAmount
: 0}
{" "}
{coin}
</p>

      </div>

      <button
className="submit-btn"
onClick={submitWithdraw}
disabled={loading}
>

{
loading
? t("submitting")
: t("submitWithdraw")
}

</button>

      
    </>
  );
}






