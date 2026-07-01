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

  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

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
    setBankName("");
    setAccountName("");
    setAccountNumber("");
  }

  async function saveBank() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!bankName || !accountName || !accountNumber) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      if (editingId) {
        await updateBank(editingId, {
          bank_name: bankName,
          account_name: accountName,
          account_number: accountNumber,
        });

        alert("แก้ไขบัญชีสำเร็จ");
      } else {

        await validateBank(
            user.id,
            bankName,
            accountName,
            accountNumber
            );

        await addBank({
          user_id: user.id,
          bank_name: bankName,
          account_name: accountName,
          account_number: accountNumber,
          is_primary: banks.length === 0,
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

    setBankName(bank.bank_name);

    setAccountName(bank.account_name);

    setAccountNumber(bank.account_number);

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

          <select
  value={bankName}
  onChange={(e) => setBankName(e.target.value)}
>

  <option value="">เลือกธนาคาร</option>

  <option>ธนาคารกรุงเทพ</option>
  <option>ธนาคารกสิกรไทย</option>
  <option>ธนาคารกรุงไทย</option>
  <option>ธนาคารไทยพาณิชย์</option>
  <option>ธนาคารกรุงศรีอยุธยา</option>
  <option>ธนาคารทหารไทยธนชาต</option>
  <option>ธนาคารออมสิน</option>
  <option>ธ.ก.ส.</option>
  <option>ธนาคารอาคารสงเคราะห์</option>
  <option>UOB</option>
  <option>CIMB Thai</option>
  <option>LH Bank</option>
  <option>KKP</option>
  <option>ICBC</option>

</select>

          <input
            placeholder="ชื่อบัญชี"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />

          <input
            placeholder="เลขบัญชี"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
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

                <h3>{bank.bank_name}</h3>

                <p>{bank.account_name}</p>

                <p>{bank.account_number}</p>

                {bank.is_primary && (
                  <span>บัญชีหลัก</span>
                )}

              </div>

              <div className="bank-actions">

                {!bank.is_primary && (

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