import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateBank } from "../lib/bankApi";
import { useTranslation } from "react-i18next";
import { useToast } from "../context/ToastContext";
import { useDialog } from "../components/DialogContext";
import "../styles/bankAccount.css";

import {
  getBank,
  addBank,
  updateBank,
  deleteBank,
  setPrimaryBank,
} from "../lib/bankApi";

export default function BankAccount() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const { showToast } = useToast();

  const { showConfirm } = useDialog();

  const [banks, setBanks] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [fullName, setFullName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    loadBanks();
  }, []);

  async function loadBanks() {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return;

      const data = await getBank(user.id);

      setBanks(data || []);
    } catch (err) {
      console.log(err);
    }
  }

  function clearForm() {
  setEditingId(null);

  setFullName("");
  setBankName("");
  setAccountNumber("");
  setSwiftCode("");
  setAddress("");
}

  async function saveBank() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!fullName || !bankName || !accountNumber) {
    showToast(t("fillAllFields"), "warning");
    return;
}

    try {
      if (editingId) {
        await updateBank(editingId,{
    bank_name: bankName,
    full_name: fullName,
    account_name: fullName,
    account_number: accountNumber,
    swift_code: swiftCode,
    residential_address: address,
});

        showToast(t("bankUpdated"), "success");
      } else {

        await validateBank(
    user.id,
    bankName,
    fullName,
    accountNumber
);

        await addBank({
    user_id: user.id,

    bank_name: bankName,

    full_name: fullName,

    account_name: fullName,

    account_number: accountNumber,

    swift_code: swiftCode,

    residential_address: address,

    is_default: banks.length === 0,
});

        showToast(t("bankAdded"), "success");
      }

      clearForm();

      setShowForm(false);

      loadBanks();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  function editBank(bank) {

  setEditingId(bank.id);

  setFullName(bank.full_name || "");
  setBankName(bank.bank_name || "");
  setAccountNumber(bank.account_number || "");
  setSwiftCode(bank.swift_code || "");
  setAddress(bank.residential_address || "");

  setShowForm(true);
}

  async function removeBank(id) {

  showConfirm({
    type: "warning",
    title: t("delete"),
    message: t("confirmDeleteBank"),

    onConfirm: async () => {

      try {

        await deleteBank(id);

        await loadBanks();

        showToast(t("deleteSuccess"), "success");

      } catch (err) {

        showToast(err.message, "error");

      }

    }

  });

}

  async function primaryBank(id) {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await setPrimaryBank(user.id, id);

      loadBanks();

      showToast(t("primaryAccount"), "success");

    } catch (err) {
  showToast(err.message, "error");
}
  }

  return (
    <div className="bank-page">

      <div className="bank-header">

        <button onClick={() => navigate(-1)}>
          ←
        </button>

        <h2>{t("bankAccounts")}</h2>

      </div>

      {showForm && (

        <div className="bank-form">

          

          <input
placeholder={t("fullName")}
value={fullName}
onChange={(e)=>setFullName(e.target.value)}
/>

<input
placeholder={t("bankName")}
value={bankName}
onChange={(e)=>setBankName(e.target.value)}
/>

<input
placeholder={t("accountNumber")}
value={accountNumber}
onChange={(e)=>setAccountNumber(e.target.value)}
/>

<input
placeholder={t("swiftCode")}
value={swiftCode}
onChange={(e)=>setSwiftCode(e.target.value)}
/>

<textarea
className="bank-textarea"
placeholder={t("residentialAddress")}
rows={6}
value={address}
onChange={(e)=>setAddress(e.target.value)}
/>

          <div className="bank-actions">

            <button
              className="primary-btn"
              onClick={saveBank}
            >
              {editingId ? t("save") : t("add")}
            </button>

            <button
              className="delete-btn"
              onClick={() => {
                clearForm();
                setShowForm(false);
              }}
            >
              {t("cancel")}
            </button>

          </div>

        </div>

      )}

      <div className="bank-list">

        {banks.length === 0 ? (

          <div className="empty">
            {t("noBankAccount")}
          </div>

        ) : (

          banks.map((bank) => (

            <div
              className="bank-card"
              key={bank.id}
            >

              <div>

                <h3>{bank.full_name}</h3>

                <p>🏦 {bank.bank_name}</p>

                <p>💳 {bank.account_number}</p>

                <p>🌐 {bank.swift_code || "-"}</p>

                <p>📍 {bank.residential_address || "-"}</p>


                {bank.is_default && (

                  <span>{t("primaryAccount")}</span>
                )}

              </div>

              <div className="bank-actions">

                {!bank.is_default && (

                  <button
                    className="primary-btn"
                    onClick={() => primaryBank(bank.id)}
                  >
                    {t("setPrimary")}
                  </button>

                )}

                <button
                  className="edit-btn"
                  onClick={() => editBank(bank)}
                >
                  {t("edit")}
                </button>

                <button
                  className="delete-btn"
                  onClick={() => removeBank(bank.id)}
                >
                  {t("delete")}
                </button>

              </div>

            </div>

          ))

        )}

      </div>

      <button
        className="add-bank-btn"
        onClick={() => {
          clearForm();
          setShowForm(true);
        }}
      >
        + {t("addBankAccount")}
      </button>

    </div>
  );
}