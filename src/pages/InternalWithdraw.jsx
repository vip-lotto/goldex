import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useToast } from "../context/ToastContext";
import { addTransaction } from "../lib/transactionApi";


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

  const [openCoin,setOpenCoin]=useState(false);
const [openNetwork,setOpenNetwork]=useState(false);

  const { showToast } = useToast();

  

  const fee = 1;

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
  }, []);

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

    const usdtNetworks = data.filter(
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

  setCoin(data[0].coin);

  const firstNetworks = data.filter(
    item => item.coin === data[0].coin
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

setLoading(true);

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );


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
  "คุณมีรายการถอนที่กำลังรอการตรวจสอบ กรุณารอการอนุมัติ",
  "warning"
);

setLoading(false);

  return;
}


      


      const { data: wallet } =
  await supabase
    .from("wallets")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .single();

if (!wallet) {

  showToast(
  "ไม่พบกระเป๋าเงิน",
  "error"
);

setLoading(false);

  return;
}

if (
  Number(amount) >
  Number(wallet.balance)
) {

  showToast(
  "ยอดเงินไม่เพียงพอ",
  "error"
);

setLoading(false);

  return;
}

    

    if (!amount) {
      showToast(
  "กรุณากรอกจำนวนเงิน",
  "warning"
);

setLoading(false);

      return;
    }



    if (!address && !qrFile) {
  showToast(
  "กรุณากรอก Wallet Address หรือแนบ QR Code",
  "warning"
);

setLoading(false);

  return;
}

    if (Number(amount) < 1) {

  showToast(
  "ถอนขั้นต่ำ 1 USDT",
  "warning"
);

setLoading(false);

  return;
}

    let qrUrl = "";

    /*

    const fileName =
      `${Date.now()}-${qrFile.name}`;

    const upload =
      await supabase.storage
        .from("withdraw-qr")
        .upload(
          fileName,
          qrFile
        );

    if (!upload.error) {

      const { data } =
        supabase.storage
          .from("withdraw-qr")
          .getPublicUrl(
            fileName
          );

      qrUrl =
        data.publicUrl;
    }

    */

    const { data, error } =
  await supabase
  .from("withdrawals")
  .insert({

    user_id:
      user.id,

    type:
      "crypto",

      coin,

      network,

      address,

      amount:
        Number(amount),

      fee,

      receive_amount:
        receiveAmount,

      qr_image:
        qrUrl,

      status:
        "pending"
    })
    .select();

console.log(
  "INSERT DATA =",
  data
);

console.log(
  "INSERT ERROR =",
  error
);

    if (error) {

      showToast(
  error.message,
  "error"
);

setLoading(false);


      return;
    }

    await supabase
  .from("wallets")
  .update({
    balance:
      Number(wallet.balance) - Number(amount)
  })
  .eq("user_id", user.id);

  const newBalance =
Number(wallet.balance)-Number(amount);

localStorage.setItem(
"wallet",
JSON.stringify({
   ...wallet,
   balance:newBalance
}));

window.dispatchEvent(
new Event("walletUpdated")
);


await addTransaction({
  user_id: user.id,
  type: "withdraw",
  amount: Number(amount),
  status: "pending",
  description: `ถอน ${amount} ${coin}`
});

    await supabase
  .from("notifications")
  .insert({

    user_id:
      user.id,

    title:
      "ส่งคำขอถอนสำเร็จ",

    message:
`ถอน ${amount} ${coin}

Network : ${network}

สถานะ : รออนุมัติ`,

    is_read:
      false

  });

    showToast(
"ส่งคำขอถอนสำเร็จ",
"success"
);

setLoading(false);

setAddress("");
setAmount("");
setQrFile(null);

};

return (

    <>

      <div className="deposit-card">

        <h3>
          Crypto
        </h3>

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

        <h3>
          Network
        </h3>

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

        <h3>
          Address
        </h3>

        <input
          value={address}
          onChange={(e) =>
            setAddress(
              e.target.value
            )
          }
          placeholder="Wallet Address"
          className="deposit-input"
        />

      </div>

      <div className="deposit-card">

        <h3>
          Wallet QR Code 
        </h3>

        <label
          className="upload-box"
        >

          <Upload size={40} />

          <p>
            {
              qrFile
              ? qrFile.name
              : " Wallet QR Code "
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

        <h3>
          Amount
        </h3>

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
          Transfer fee :
          {fee} USDT
        </p>

        <p>
          Amount received :
          {receiveAmount > 0
            ? receiveAmount
            : 0}
          {" "}
          USDT
        </p>

      </div>

      <button
className="submit-btn"
onClick={submitWithdraw}
disabled={loading}
>

{loading
? "กำลังส่ง..."
: "ส่งคำขอถอน"}

</button>

      
    </>
  );
}






