import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useToast } from "../context/ToastContext";
import "../styles/changePassword.css";

export default function ChangePassword() {

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function changePassword() {

    if (loading) return;

    if (
      !oldPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      showToast(
        "กรุณากรอกข้อมูลให้ครบ",
        "warning"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast(
        "รหัสผ่านใหม่ไม่ตรงกัน",
        "warning"
      );
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {
      showToast(
        "กรุณาเข้าสู่ระบบ",
        "warning"
      );
      return;
    }

    setLoading(true);

    const { data: profile, error } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {
      showToast(error.message, "error");
      setLoading(false);
      return;
    }

    if (profile.password !== oldPassword) {
      showToast(
        "รหัสผ่านเดิมไม่ถูกต้อง",
        "error"
      );
      setLoading(false);
      return;
    }

    const { error: updateError } =
      await supabase
        .from("profiles")
        .update({
          password: newPassword
        })
        .eq("id", user.id);

    setLoading(false);

    if (updateError) {
      showToast(
        updateError.message,
        "error"
      );
      return;
    }

    showToast(
      "เปลี่ยนรหัสผ่านสำเร็จ",
      "success"
    );

    navigate(-1);

  }

  return (

    <div className="change-password-page">

      <div className="change-header">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={22}/>
        </button>

        <h2>เปลี่ยนรหัสผ่าน</h2>

      </div>

      <div className="change-card">

        <div className="input-box">

          <Lock size={20}/>

          <input
            type="password"
            placeholder="รหัสผ่านเดิม"
            value={oldPassword}
            onChange={(e)=>
              setOldPassword(e.target.value)
            }
          />

        </div>

        <div className="input-box">

          <Lock size={20}/>

          <input
            type="password"
            placeholder="รหัสผ่านใหม่"
            value={newPassword}
            onChange={(e)=>
              setNewPassword(e.target.value)
            }
          />

        </div>

        <div className="input-box">

          <Lock size={20}/>

          <input
            type="password"
            placeholder="ยืนยันรหัสผ่านใหม่"
            value={confirmPassword}
            onChange={(e)=>
              setConfirmPassword(e.target.value)
            }
          />

        </div>

        <button
          className="save-btn"
          onClick={changePassword}
          disabled={loading}
        >

          {
            loading
              ? "Loading..."
              : "บันทึก"
          }

        </button>

      </div>

    </div>

  );

}