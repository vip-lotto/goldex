import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";



export default function Notifications() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [items, setItems] = useState([]);

  useEffect(() => {

  init();

  const interval =
    setInterval(() => {

      loadNotifications();

    }, 10000);

  return () =>
    clearInterval(interval);

}, []);

  const init = async () => {
    await markAsRead();
    await loadNotifications();
  };

  const markAsRead = async () => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) return;

    console.log("USER =", user);

    const { data, error } =
      await supabase
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq(
  "user_id",
  Number(user.id)
)
.select();

    console.log(
      "MARK READ DATA =",
      data
    );

    console.log(
      "MARK READ ERROR =",
      error
    );
  };

  const loadNotifications = async () => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) return;

    const { data, error } =
      await supabase
        .from("notifications")
        .select("*")
        .eq(
          "user_id",
          Number(user.id)
        )
        .order("id", {
          ascending: false,
        });

    console.log(
      "LOAD DATA =",
      data
    );

    console.log(
      "LOAD ERROR =",
      error
    );

    setItems(data || []);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#02133b",
        padding: "20px",
        color: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <ArrowLeft
          size={28}
          style={{
            cursor: "pointer",
            color: "#FFD54F",
          }}
          onClick={() => navigate(-1)}
        />

        <h2
          style={{
            margin: 0,
            color: "#fff",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          {t("notifications")}
        </h2>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "60px",
            color: "#bfc9e0",
          }}
        >
          {t("noNotifications")}
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#102c73",
              padding: "16px",
              borderRadius: "16px",
              marginBottom: "14px",
              boxShadow:
                "0 2px 12px rgba(0,0,0,0.25)",
            }}
          >
            <h3
  style={{
    margin: "0 0 10px",
    color: "#fff",
    fontSize: "20px",
  }}
>
  {t(item.title_key || item.title)}
</h3>

            <p
  style={{
    margin: "0 0 10px",
    whiteSpace: "pre-line",
    color: "#e8ecff",
    lineHeight: "1.6",
  }}
>
  {item.message_key ? (
    <>
      {t(item.message_key)}
      <br />
      <br />
      {t("coin")} : {item.coin}
      <br />
      {t("network")} : {item.network}
      <br />
      {t("amount")} : {item.amount}
      <br />
      {t("status")} : {t(item.status)}
    </>
  ) : (
    item.message
  )}
</p>

            <small
              style={{
                color: "#cdd5f5",
              }}
            >
              {
  item.created_at
    ? new Date(
        item.created_at
      ).toLocaleString()
    : "-"
}
            </small>
          </div>
        ))
      )}
    </div>
  );
}