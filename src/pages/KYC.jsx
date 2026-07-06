import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, IdCard, Camera } from "lucide-react";

import { getProfile } from "../lib/profileApi";
import { supabase } from "../lib/supabase";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";

import "../styles/kyc.css";

export default function KYC() {

  const navigate = useNavigate();

const { showToast } = useToast();

const { t } = useTranslation();

  const [profile, setProfile] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [documentType, setDocumentType] = useState("ID Card");
  const [country, setCountry] = useState("");

  const [idCard, setIdCard] = useState(null);
  const [selfie, setSelfie] = useState(null);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);


  useEffect(() => {

    loadProfile();

  }, []);

  async function loadProfile() {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) return;

    const data = await getProfile(user.id);

    if (data) {

      setProfile(data);

      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");

    }

    setLoading(false);

  }

  async function uploadImage(file, folder) {

  if (!file) return null;

  const fileName =
    `${Date.now()}-${file.name}`;

  const filePath =
    `${folder}/${fileName}`;

  const { error } =
    await supabase.storage
      .from("kyc")
      .upload(filePath, file);

  if (error) throw error;

  const { data } =
    supabase.storage
      .from("kyc")
      .getPublicUrl(filePath);

  return data.publicUrl;

}

async function submitKYC() {

  try {

    if (
      !firstName ||
      !lastName ||
      !idNumber
    ) {

      showToast(
        t("fillAllFields"),
        "warning"
      );

      return;

    }

    if (!idCard || !selfie) {

      showToast(
         t("uploadAllImages"),
        "warning"
      );

      return;

    }

    setUploading(true);

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const idCardUrl =
      await uploadImage(
        idCard,
        "idcard"
      );

    const selfieUrl =
      await uploadImage(
        selfie,
        "selfie"
      );

    const { error } =
      await supabase
  .from("kyc")
  .insert({

    user_id: user.id,

    first_name: firstName,

    last_name: lastName,

    document_type: documentType,

    id_number: idNumber,

    country,

    id_card_image: idCardUrl,

    selfie_image: selfieUrl,

    status: "pending"

  });

    if (error) throw error;

    showToast(
      t("kycSubmitted"),
      "success"
    );

    navigate(-1);

  } catch (err) {

    console.log(err);

    showToast(
      err.message,
      "error"
    );

  } finally {

    setUploading(false);

  }

}

  return (

    <div className="kyc-page">

      <div className="kyc-header">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >

          <ArrowLeft size={22}/>

        </button>

        <h2>KYC Verification</h2>

      </div>

      <div className="kyc-card">

        <div className="input-group">

          <label>{t("firstName")}</label>

          <input
            value={firstName}
            onChange={(e)=>
              setFirstName(e.target.value)
            }
          />

        </div>

        <div className="input-group">

          <label>{t("lastName")}</label>

          <input
            value={lastName}
            onChange={(e)=>
              setLastName(e.target.value)
            }
          />

        </div>

        <div className="input-group">

  <label>{t("documentType")}</label>

  <select
    className="kyc-select"
    value={documentType}
    onChange={(e)=>setDocumentType(e.target.value)}
  >
    <option value="ID Card">{t("idCard")}</option>
<option value="Passport">{t("passport")}</option>
<option value="License">{t("driverLicense")}</option>
  </select>

  <input
    placeholder={
  documentType === "Passport"
    ? t("passportNumber")
    : documentType === "License"
    ? t("driverLicenseNumber")
    : t("idCardNumber")
}

    value={idNumber}
    onChange={(e)=>setIdNumber(e.target.value)}
  />

</div>

        <div className="input-group">

          <label>{t("country")}</label>

          <input
            value={country}
            onChange={(e)=>
              setCountry(e.target.value)
            }
          />

        </div>

        <div className="upload-box id-card-box">

          <IdCard size={34}/>

          <h3>{t("uploadIdCard")}</h3>

          <label className="upload-area">

  <input
    type="file"
    accept="image/*"
    hidden
    onChange={(e)=>setIdCard(e.target.files[0])}
  />

  <Upload size={46} />

  <h4>{t("clickToUpload")}</h4>

  
  {
    idCard &&
    <span className="file-name">
      {idCard.name}
    </span>
  }

</label>

          {

            idCard &&

            <p>

              {idCard.name}

            </p>

          }

        </div>

        <div className="upload-box selfie-box">

          <Camera size={34}/>

          <h3>{t("uploadSelfie")}</h3>

          <label className="upload-area">

  <input
    type="file"
    accept="image/*"
    hidden
    onChange={(e)=>setSelfie(e.target.files[0])}
  />

  <Upload size={46} />

  <h3>{t("clickToUpload")}</h3>

  

  {
    selfie &&
    <span className="file-name">
      {selfie.name}
    </span>
  }

</label>

          {

            selfie &&

            <p>

              {selfie.name}

            </p>

          }

        </div>

        <button
  className="submit-btn"
  onClick={submitKYC}
  disabled={uploading}
>

          <Upload size={20}/>

          {
  uploading
  ? t("submitting")
  : t("submit")
}

        </button>

      </div>

    </div>

  );

}