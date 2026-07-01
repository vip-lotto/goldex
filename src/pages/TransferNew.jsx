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

    <select
      value={coin}
      onChange={(e)=>
        setCoin(
          e.target.value
        )
      }
      style={{
        width:"100%",
        padding:"15px",
        borderRadius:"15px",
        background:"#1a1d23",
        color:"#fff",
        border:"none"
      }}
    >

      {[...new Set(walletList.map(item => item.coin))].map((item) => (

  <option
    key={item}
    value={item}
  >
    {item}
  </option>

))}

    </select>

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

    <select
      value={network}
      onChange={(e)=>
        setNetwork(
          e.target.value
        )
      }
      style={{
        width:"100%",
        padding:"15px",
        borderRadius:"15px",
        background:"#1a1d23",
        color:"#fff",
        border:"none"
      }}
    >

      {[...new Set(
  walletList
    .filter(item => item.coin === coin)
    .map(item => item.network)
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
