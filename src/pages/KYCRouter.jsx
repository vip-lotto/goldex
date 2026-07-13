import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function KYCRouter() {

  const navigate = useNavigate();

  useEffect(() => {
    checkKYC();
  }, []);

  async function checkKYC() {

    // ใช้ localStorage เหมือนทั้งโปรเจกต์
    const localUser = JSON.parse(
      localStorage.getItem("user")
    );

    console.log("LOCAL USER =", localUser);
console.log("LOCAL USER ID =", localUser.id);
console.log("LOCAL USER EMAIL =", localUser.email);

    if (!localUser) {
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
  .from("kyc")
  .select("*")
  .eq("user_id", localUser.id)
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();

console.log("========== KYC ==========");
console.log("LOCAL USER =", localUser);
console.log("LOCAL USER ID =", localUser?.id);
console.log("ERROR =", error);
console.log("KYC DATA =", data);
console.log("=========================");

    if (error) {
  console.log("SUPABASE ERROR =", error);
  return;
}

    // ยังไม่เคยส่ง KYC
    if (!data) {
  console.log("NO KYC RECORD");
  navigate("/kyc-form");
  return;
}

    switch (data.status) {

      case "pending":
        navigate("/kyc/review");
        break;

      case "approved":
        navigate("/kyc/approved");
        break;

      case "rejected":
        navigate("/kyc/rejected");
        break;

      default:
        navigate("/kyc-form");
        break;
    }

  }

  return null;

}