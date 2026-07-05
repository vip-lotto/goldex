import { useEffect, useState } from "react";
import {
ArrowLeft,
ScanLine,
Clipboard
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import QRScanner from "../components/QRScanner";
import { useToast } from "../context/ToastContext";

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


export default function TransferNew() {

const navigate = useNavigate();

const { showToast } = useToast();

const [showScanner, setShowScanner] =
useState(false);

const [address, setAddress] =
useState("");

const [amount, setAmount] =
useState("");

const [coin, setCoin] =
useState("USDT");

const [network, setNetwork] =
useState("TRC20");

const [walletList, setWalletList] =
useState([]);

const [openCoin,setOpenCoin]=useState(false);
const [openNetwork,setOpenNetwork]=useState(false);

const loadWalletList = async () => {

  const { data, error } =
    await supabase
      .from("user_wallets")
      .select("coin, network");

  if (!error) {

    setWalletList(data);

  }

};

const pasteAddress = async () => {

  try {

    const text =
      await navigator.clipboard.readText();

    setAddress(text);

  } catch {

    showToast(
      "ไม่สามารถวางข้อมูลได้",
      "error"
    );

  }

};


useEffect(() => {

  loadWalletList();

}, []);


const handleSubmit = async () => {

  const user =
  JSON.parse(
    localStorage.getItem("user")
  );

if (!user) {

  showToast(
  "ไม่พบข้อมูลผู้ใช้",
  "error"
);

  return;

}

if (!address) {

  showToast(
  "กรุณากรอก Address",
  "warning"
);

  return;

}



  if (!amount) {

  showToast(
    "กรุณากรอกจำนวนเงิน",
    "warning"
  );

  return;

}

const { data: senderWallet } =
await supabase
  .from("wallets")
  .select("*")
  .eq("user_id", user.id)
  .single();

if (!senderWallet) {

  showToast(
  "ไม่พบ Wallet ผู้ส่ง",
  "error"
);

  return;

}

if (
  Number(senderWallet.balance)
  <
  Number(amount)
) {
  showToast(
  "ยอดเงินไม่พอ",
  "error"
);



return;
  
}

const {
  data: receiverAddress
} =
await supabase
  .from("user_wallets")
  .select("*")
  .eq("address", address)
  .eq("coin", coin)
  .eq("network", network)
  .single();

if (!receiverAddress) {

  showToast(
  "ไม่พบ Address ผู้รับ",
  "error"
);

  return;

}

const receiverId =
receiverAddress.user_id;

if (
  Number(receiverId)
  ===
  Number(user.id)
) {

  showToast(
  "โอนให้ตัวเองไม่ได้",
  "error"
);

  return;

}

const {
  data: receiverWallet
} = await supabase
  .from("wallets")
  .select("*")
  .eq("user_id", receiverId)
  .single();

  
  if (!receiverWallet) {

  showToast(
    "ไม่พบ Wallet ผู้รับ",
    "error"
  );

  return;

}


  


const { data, error } = await supabase
  .from("transfers")
  .insert([
    {
      sender_id: user.id,
      receiver_id: receiverId,
      amount: Number(amount),
      coin,
      network,
      status: "success",
    },
  ]);

console.log("Transfer Data:", data);
console.log("Transfer Error:", error);
if (error) {

  showToast(
    error.message,
    "error"
  );

  return;

}

const { error: senderError } =
await supabase
  .from("wallets")
  .update({
    balance:
      Number(senderWallet.balance)
      - Number(amount)
  })
  .eq("user_id", user.id);

if (senderError) {

  showToast(
    senderError.message,
    "error"
  );

  return;

}

const { error: receiverError } =
await supabase
  .from("wallets")
  .update({
    balance:
      Number(receiverWallet.balance)
      + Number(amount)
  })
  .eq("user_id", receiverId);

if (receiverError) {

  showToast(
    receiverError.message,
    "error"
  );

  return;

}


  const { error: notifyReceiverError } =
await supabase
  .from("notifications")
  .insert([
    {
      user_id: receiverId,
      title: "ได้รับเงิน",
      message: `ได้รับ ${amount} ${coin}`
    }
  ]);

if (notifyReceiverError) {

  console.log(notifyReceiverError);

}

  const { error: notifySenderError } =
await supabase
  .from("notifications")
  .insert([
    {
      user_id: user.id,
      title: "โอนเงินสำเร็จ",
      message: `โอน ${amount} ${coin} ไปยัง ${address}`
    }
  ]);

if (notifySenderError) {

  console.log(notifySenderError);

}


  showToast(
  "โอนเงินสำเร็จ",
  "success"
);




navigate("/transfer-receipt", {
  state: {
    amount,
    coin,
    network,
    address,
    time: new Date().toLocaleString(),
    txid: "TX" + Date.now()
  }
});


};
return (


<div
  style={{
    minHeight:"100vh",
    background:"#111318",
    color:"#fff",
    padding:"20px",
    paddingBottom:"120px"
  }}
>

  <div
    style={{
      display:"flex",
      alignItems:"center",
      gap:"12px",
      marginBottom:"30px"
    }}
  >

    <ArrowLeft
      onClick={() => navigate(-1)}
      style={{
        cursor:"pointer"
      }}
    />

    <h2
      style={{
        margin:0
      }}
    >
      Send Crypto
    </h2>

  </div>

  <div>

    <h3>Coin</h3>

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

{[...new Set(walletList.map(w=>w.coin))]
.map(item=>(

<div
key={item}
className="dropdown-item"
onClick={()=>{

setCoin(item);

const networks =
walletList.filter(
w=>w.coin===item
);

const trc20 =
networks.find(
w=>w.network==="TRC20"
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

  <div
    style={{
      marginTop:"20px"
    }}
  >

    <h3>Address</h3>

    <div
      style={{
        border:"2px solid #c99a18d2",
        borderRadius:"16px",
        padding:"15px",
        display:"flex",
        alignItems:"center",
        gap:"10px"
      }}
    >

      <input
        value={address}
        onChange={(e)=>
          setAddress(
            e.target.value
          )
        }
        placeholder="Wallet Address"
        style={{
          flex:1,
          background:"transparent",
          border:"none",
          outline:"none",
          color:"#fff"
        }}
      />

      <button
        onClick={pasteAddress}
        style={{
          background:"none",
          border:"none",
          color:"#c99a18d2"
        }}
      >
        <Clipboard />
      </button>

      <button
        onClick={()=>
          setShowScanner(true)
        }
        style={{
          background:"none",
          border:"none",
          color:"#c99a18d2"
        }}
      >
        <ScanLine />
      </button>

    </div>

  </div>

  <div
    style={{
      marginTop:"20px"
    }}
  >

    <h3>Network</h3>

    <div
  className="custom-select"
  onClick={() => setOpenNetwork(!openNetwork)}
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

{[...new Set(

walletList
.filter(w=>w.coin===coin)
.map(w=>w.network)

)]
.sort((a,b)=>{

const priority=[
"TRC20",
"ERC20",
"BEP20",
"BEP2",
"POLYGON",
"SOL"
];

const ai=priority.indexOf(a);
const bi=priority.indexOf(b);

if(ai===-1 && bi===-1)
return a.localeCompare(b);

if(ai===-1) return 1;
if(bi===-1) return -1;

return ai-bi;

})

.map(item=>(

<div
key={item}
className="dropdown-item"
onClick={()=>{

setNetwork(item);
setOpenNetwork(false);

}}
>

<img
src={NETWORK_LOGO[item]}
className="coin-icon"
alt=""
/>

{item}

</div>

))

}

</div>

)}

  </div>

  <div
    style={{
      marginTop:"20px"
    }}
  >

    <h3>Amount</h3>

    <input
      type="number"
      value={amount}
      onChange={(e)=>
        setAmount(
          e.target.value
        )
      }
      placeholder="0.00"
      style={{
        width:"100%",
        padding:"15px",
        borderRadius:"15px",
        background:"#1a1d23",
        color:"#fff",
        border:"none"
      }}
    />

  </div>

  <button
  onClick={handleSubmit}
  style={{
    position:"fixed",
    left:"20px",
    right:"20px",
    bottom:"90px",
    height:"60px",
    border:"none",
    borderRadius:"30px",
    background:"#f0b906de",
    color:"#000",
    fontWeight:"bold",
    fontSize:"20px",
    zIndex:998
  }}
>



    Next
  </button>

  {
    showScanner && (

      <QRScanner
        onScan={(text)=>{

          setAddress(text);

          setShowScanner(false);

        }}
        onClose={()=>
          setShowScanner(false)
        }
      />

    )
  }


  
</div>


);

}
