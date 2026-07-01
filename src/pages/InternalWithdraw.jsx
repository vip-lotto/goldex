import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useToast } from "../context/ToastContext";
import { addTransaction } from "../lib/transactionApi";


export default function InternalWithdraw() {

  const [wallets, setWallets] = useState([]);

  const [coin, setCoin] = useState("");
  const [network, setNetwork] = useState("");

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const [qrFile, setQrFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  

  const fee = 1;

  const receiveAmount =
  Math.max(
    Number(amount || 0) - fee,
    0
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
          เลือกเหรียญ
        </h3>

        <select
          value={coin}
          onChange={
            handleCoinChange
          }
        >

          {
            [
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
    item =>
      item.coin === coin
  )
  .sort((a,b)=>
    a.network.localeCompare(
      b.network
    )
  )
  .map((item) => (

              <option
                key={item.id}
                value={
                  item.network
                }
              >
                {item.network}
              </option>

            ))}

        </select>

      </div>

      <div className="deposit-card">

        <h3>
          ที่อยู่ปลายทาง
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
          QR Code Wallet
        </h3>

        <label
          className="upload-box"
        >

          <Upload size={40} />

          <p>
            {
              qrFile
              ? qrFile.name
              : " QR Code Wallet"
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
          จำนวนเงิน
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
          ค่าธรรมเนียม :
          {fee} USDT
        </p>

        <p>
          ได้รับจริง :
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

