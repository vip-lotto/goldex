import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";
import "../styles/changePassword.css";

export default function ChangePassword() {

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation();

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
         t("fillAllFields"),
        "warning"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast(
        t("passwordNotMatch"),
        "warning"
      );
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {
      showToast(
        t("pleaseLogin"),
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
        t("oldPasswordIncorrect"),
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
      t("passwordChanged"),
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

        <h2>{t("changePassword")}</h2>

      </div>

      <div className="change-card">

        <div className="input-box">

          <Lock size={20}/>

          <input
            type="password"
            placeholder={t("oldPassword")}
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
            placeholder={t("newPassword")}
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
            placeholder={t("confirmPassword")}
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
  ? t("loading")
  : t("save")
          }

        </button>

      </div>

    </div>

  );

}