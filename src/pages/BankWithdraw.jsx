import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Toast from "../components/Toast";
import { useTranslation } from "react-i18next";


export default function BankWithdraw() {

  const { t } = useTranslation();

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
   t("pleaseAddBank")
  );

  return;
}

if (!amount) {

  notify(
    t("enterAmount")
  );

  return;
}

if (
  Number(amount) <= fee
) {

  notify(
    t("minimumWithdraw")
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
  t("withdrawSubmitted")
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
    {t("loading")}
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
        {t("noBankAccount")}
      </h3>

      <p
        style={{
          color:"#aaa"
        }}
      >
        {t("addBankAccountMessage")}
      </p>

    </div>

  )}

  {bank && (

    <div
      className="deposit-card"
    >

      <h3>
        {t("destinationAccount")}
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
      {t("amount")}
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
        {t("transferFee")}
      </span>

      <strong>
        {fee} USDT
      </strong>

    </div>

    <div
      className="summary-row"
    >

      <span>
        {t("amountReceived")}
      </span>

      <strong className="receive">
  {receiveAmount > 0 ? receiveAmount : 0}{" "}
  <span className="receive-unit">USDT</span>
</strong>

    </div>

  </div>

  <button
    className="submit-btn"
    onClick={
      submitWithdraw
    }
  >
    {t("submitWithdraw")}
  </button>

  <Toast
    show={showToast}
    message={toastMsg}
  />

</>


);
}
