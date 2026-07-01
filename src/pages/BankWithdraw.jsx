import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Toast from "../components/Toast";

export default function BankWithdraw() {

const [bank, setBank] = useState(null);

const [amount, setAmount] =
useState("");

const [loading, setLoading] =
useState(true);

const [showToast,
setShowToast] =
useState(false);

const [toastMsg,
setToastMsg] =
useState("");

const fee = 10;

const receiveAmount =
Number(amount || 0) - fee;

useEffect(() => {
loadBankAccount();
}, []);

const notify = (msg) => {


setToastMsg(msg);

setShowToast(true);

setTimeout(() => {
  setShowToast(false);
}, 2500);


};

const loadBankAccount =
async () => {


const user =
  JSON.parse(
    localStorage.getItem("user")
  );

if (!user) return;

const { data, error } =
  await supabase
    .from("bank_accounts")
    .select("*")
    .eq(
      "user_id",
      user.id
    )
    .eq(
      "is_default",
      true
    )
    .maybeSingle();

if (!error && data) {
  setBank(data);
}

setLoading(false);


};

const submitWithdraw =
async () => {


const user =
  JSON.parse(
    localStorage.getItem("user")
  );

if (!bank) {

  notify(
    "กรุณาผูกบัญชีธนาคารก่อน"
  );

  return;
}

if (!amount) {

  notify(
    "กรุณากรอกจำนวนเงิน"
  );

  return;
}

if (
  Number(amount) <= fee
) {

  notify(
    "จำนวนเงินน้อยเกินไป"
  );

  return;
}

const { error } =
  await supabase
    .from("withdrawals")
    .insert({

      user_id:
        user.id,

      type:
        "bank",

      bank_name:
        bank.bank_name,

      bank_account_name:
        bank.account_name,

      bank_account_number:
        bank.account_number,

      amount:
        Number(amount),

      fee,

      receive_amount:
        receiveAmount,

      status:
        "pending"

    });

if (error) {

  notify(
    error.message
  );

  return;
}

notify(
  "ส่งคำขอถอนสำเร็จ"
);

setAmount("");


};

if (loading) {


return (
  <div
    style={{
      color:"#fff",
      padding:"20px"
    }}
  >
    กำลังโหลด...
  </div>
);


}

return (


<>

  {!bank && (

    <div
      className="deposit-card"
    >

      <h3>
        ยังไม่ได้ผูกบัญชี
      </h3>

      <p
        style={{
          color:"#aaa"
        }}
      >
        กรุณาไปผูกบัญชีธนาคาร
        ที่หน้า Assets
      </p>

    </div>

  )}

  {bank && (

    <div
      className="deposit-card"
    >

      <h3>
        บัญชีปลายทาง
      </h3>

      <div
        className="bank-card"
      >

        <div
          className="bank-name"
        >
          {bank.bank_name}
        </div>

        <div>
          {bank.account_name}
        </div>

        <div>
          {bank.account_number}
        </div>

      </div>

    </div>

  )}

  <div
    className="deposit-card"
  >

    <h3>
      จำนวนเงิน
    </h3>

    <input
      type="number"
      className="deposit-input"
      placeholder="0.00"
      value={amount}
      onChange={(e)=>
        setAmount(
          e.target.value
        )
      }
    />

  </div>

  <div
    className="withdraw-summary"
  >

    <div
      className="summary-row"
    >

      <span>
        ค่าธรรมเนียม
      </span>

      <strong>
        {fee} บาท
      </strong>

    </div>

    <div
      className="summary-row"
    >

      <span>
        ได้รับจริง
      </span>

      <strong
        className="receive"
      >
        {receiveAmount > 0
          ? receiveAmount
          : 0}
        บาท
      </strong>

    </div>

  </div>

  <button
    className="submit-btn"
    onClick={
      submitWithdraw
    }
  >
    ส่งคำขอถอน
  </button>

  <Toast
    show={showToast}
    message={toastMsg}
  />

</>


);
}
