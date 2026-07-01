import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateBank } from "../lib/bankApi";
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
    alert("กรุณากรอกข้อมูลให้ครบ");
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

        alert("แก้ไขบัญชีสำเร็จ");
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

        alert("เพิ่มบัญชีสำเร็จ");
      }

      clearForm();

      setShowForm(false);

      loadBanks();
    } catch (err) {
      alert(err.message);
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
    if (!window.confirm("ลบบัญชีนี้ใช่หรือไม่")) return;

    try {
      await deleteBank(id);

      loadBanks();
    } catch (err) {
      alert(err.message);
    }
  }

  async function primaryBank(id) {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await setPrimaryBank(user.id, id);

      loadBanks();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="bank-page">

      <div className="bank-header">

        <button onClick={() => navigate(-1)}>
          ←
        </button>

        <h2>บัญชีธนาคาร</h2>

      </div>

      {showForm && (

        <div className="bank-form">

          

          <input
placeholder="Full Name"
value={fullName}
onChange={(e)=>setFullName(e.target.value)}
/>

<input
placeholder="Bank Name"
value={bankName}
onChange={(e)=>setBankName(e.target.value)}
/>

<input
placeholder="Account Number"
value={accountNumber}
onChange={(e)=>setAccountNumber(e.target.value)}
/>

<input
placeholder="SWIFT / BIC"
value={swiftCode}
onChange={(e)=>setSwiftCode(e.target.value)}
/>

<textarea
className="bank-textarea"
placeholder="Residential Address"
rows={6}
value={address}
onChange={(e)=>setAddress(e.target.value)}
/>

          <div className="bank-actions">

            <button
              className="primary-btn"
              onClick={saveBank}
            >
              {editingId ? "บันทึก" : "เพิ่ม"}
            </button>

            <button
              className="delete-btn"
              onClick={() => {
                clearForm();
                setShowForm(false);
              }}
            >
              ยกเลิก
            </button>

          </div>

        </div>

      )}

      <div className="bank-list">

        {banks.length === 0 ? (

          <div className="empty">
            ยังไม่มีบัญชีธนาคาร
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

                  <span>บัญชีหลัก</span>
                )}

              </div>

              <div className="bank-actions">

                {!bank.is_default && (

                  <button
                    className="primary-btn"
                    onClick={() => primaryBank(bank.id)}
                  >
                    ตั้งเป็นหลัก
                  </button>

                )}

                <button
                  className="edit-btn"
                  onClick={() => editBank(bank)}
                >
                  แก้ไข
                </button>

                <button
                  className="delete-btn"
                  onClick={() => removeBank(bank.id)}
                >
                  ลบ
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
        + เพิ่มบัญชีธนาคาร
      </button>

    </div>
  );
}