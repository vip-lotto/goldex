import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Pencil,
  Wallet,
} from "lucide-react";

import { supabase } from "../../lib/supabase";
import "./AdminDepositWallet.css";

export default function AdminDepositWallet() {

  const navigate = useNavigate();

  const [wallets, setWallets] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [qrFile, setQrFile] = useState(null);

  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    coin: "USDT",
    network: "TRC20",
    address: "",
    enabled: true,
    sort: 1,
  });

  const coins = [
    "USDT",
    "BTC",
    "ETH",
    "BNB",
    "SOL",
    "XRP",
    "DOGE",
    "TRX",
    "TON",
    "ADA",
    "DOT",
    "LTC",
    "BCH",
    "AVAX",
    "LINK",
    "FIL",
    "NEAR",
    "ATOM",
    "APT",
    "ARB",
    "OP",
    "MATIC",
    "SUI",
  ];

  const networks = {
    USDT: [
      "TRC20",
      "ERC20",
      "BEP20",
      "POLYGON",
    ],

    BTC: [
      "BTC",
    ],

    ETH: [
      "ERC20",
    ],

    BNB: [
      "BEP20",
      "BEP2",
    ],

    SOL: [
      "SOL",
    ],

    XRP: [
      "XRP",
    ],

    DOGE: [
      "DOGE",
    ],

    TRX: [
      "TRC20",
    ],

    TON: [
      "TON",
    ],

    ADA: [
      "ADA",
    ],

    DOT: [
      "DOT",
    ],

    LTC: [
      "LTC",
    ],

    BCH: [
      "BCH",
    ],

    AVAX: [
      "AVAX",
    ],

    LINK: [
      "ERC20",
    ],

    FIL: [
      "FIL",
    ],

    NEAR: [
      "NEAR",
    ],

    ATOM: [
      "ATOM",
    ],

    APT: [
      "APT",
    ],

    ARB: [
      "ARB",
    ],

    OP: [
      "OP",
    ],

    MATIC: [
      "POLYGON",
    ],

    SUI: [
      "SUI",
    ],
  };

  useEffect(() => {
    loadWallets();
  }, []);

  async function loadWallets() {

    setLoading(true);

    const { data } = await supabase
      .from("deposit_wallets")
      .select("*")
      .order("sort", {
        ascending: true,
      });

    setWallets(data || []);

    setLoading(false);

  }

  function resetForm() {

    setEditingId(null);

    setQrFile(null);

    setPreview("");

    setForm({
      coin: "USDT",
      network: "TRC20",
      address: "",
      enabled: true,
      sort: wallets.length + 1,
    });

  }

    function editWallet(item) {

    setEditingId(item.id);

    setPreview(item.qr_url || "");

    setForm({
      coin: item.coin,
      network: item.network,
      address: item.address,
      enabled: item.enabled,
      sort: item.sort,
    });

  }

  async function saveWallet() {

    if (!form.address) {
      alert("Please enter wallet address");
      return;
    }

    setSaving(true);

    let qr_url = preview;

    if (qrFile) {

      const fileName =
        Date.now() + "_" + qrFile.name;

      const {
        error
      } = await supabase.storage
        .from("deposit-wallet-qr")
        .upload(fileName, qrFile);

      if (error) {

        alert(error.message);

        setSaving(false);

        return;

      }

      const { data } =
        supabase.storage
          .from("deposit-wallet-qr")
          .getPublicUrl(fileName);

      qr_url = data.publicUrl;

    }

    if (editingId) {

      await supabase
        .from("deposit_wallets")
        .update({

          coin: form.coin,

          network: form.network,

          address: form.address,

          enabled: form.enabled,

          sort: form.sort,

          qr_url

        })
        .eq("id", editingId);

      alert("Update Success");

    } else {

      await supabase
        .from("deposit_wallets")
        .insert({

          coin: form.coin,

          network: form.network,

          address: form.address,

          enabled: form.enabled,

          sort: form.sort,

          qr_url

        });

      alert("Save Success");

    }

    resetForm();

    loadWallets();

    setSaving(false);

  }

  async function deleteWallet(id) {

    const ok =
      window.confirm(
        "Delete this wallet?"
      );

    if (!ok) return;

    await supabase
      .from("deposit_wallets")
      .delete()
      .eq("id", id);

    loadWallets();

  }

  return (

    <div className="admin-wallet-page">

      <div className="admin-wallet-header">

        <button
          className="back-btn"
          onClick={() => navigate("/admin")}
        >

          <ArrowLeft size={20} />

          Back

        </button>

        <h1>

          Deposit Wallet

        </h1>

      </div>

      <div className="wallet-form">

                <div className="form-group">

          <label>Coin</label>

          <select
            value={form.coin}
            onChange={(e) => {

              const coin = e.target.value;

              setForm({
                ...form,
                coin,
                network: networks[coin][0],
              });

            }}
          >

            {

              coins.map((coin) => (

                <option
                  key={coin}
                  value={coin}
                >

                  {coin}

                </option>

              ))

            }

          </select>

        </div>

        <div className="form-group">

          <label>Network</label>

          <select
            value={form.network}
            onChange={(e) =>
              setForm({
                ...form,
                network: e.target.value,
              })
            }
          >

            {

              networks[form.coin].map((net) => (

                <option
                  key={net}
                  value={net}
                >

                  {net}

                </option>

              ))

            }

          </select>

        </div>

        <div className="form-group">

          <label>Wallet Address</label>

          <textarea
            rows={4}
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
            placeholder="Wallet Address"
          />

        </div>

        <div className="form-group">

          <label>Display Order</label>

          <input
            type="number"
            value={form.sort}
            onChange={(e) =>
              setForm({
                ...form,
                sort: Number(e.target.value),
              })
            }
          />

        </div>

        <div className="form-group">

          <label>Upload QR Code</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {

              const file = e.target.files[0];

              if (!file) return;

              setQrFile(file);

              setPreview(
                URL.createObjectURL(file)
              );

            }}
          />

        </div>

        {

          preview && (

            <img
              src={preview}
              alt=""
              className="preview-image"
            />

          )

        }

        <label className="switch">

          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) =>
              setForm({
                ...form,
                enabled: e.target.checked,
              })
            }
          />

          Enable Wallet

        </label>

        <div className="form-buttons">

          <button
            className="save-btn"
            disabled={saving}
            onClick={saveWallet}
          >

            <Save size={18} />

            {

              saving
                ? "Saving..."
                : editingId
                ? "Update"
                : "Save"

            }

          </button>

          <button
            className="reset-btn"
            onClick={resetForm}
          >

            <Plus size={18} />

            New

          </button>

        </div>

      </div>

      <div className="wallet-list">

        <h2>

          <Wallet size={22} />

          Deposit Wallet List

        </h2>

                {

          loading

          ?

          <div className="loading">

            Loading...

          </div>

          :

          wallets.length===0

          ?

          <div className="loading">

            No Wallet

          </div>

          :

          wallets.map(item=>(

            <div
              key={item.id}
              className="wallet-card"
            >

              <div className="wallet-left">

                <img
                  src={item.qr_url}
                  alt=""
                  className="wallet-qr"
                />

                <div>

                  <h3>

                    {item.coin}

                  </h3>

                  <p>

                    {item.network}

                  </p>

                  <p className="wallet-address">

                    {item.address}

                  </p>

                  <span>

                    Order : {item.sort}

                  </span>

                </div>

              </div>

              <div className="wallet-right">

                <div
                  className={
                    item.enabled
                    ?
                    "status on"
                    :
                    "status off"
                  }
                >

                  {

                    item.enabled

                    ?

                    "Enabled"

                    :

                    "Disabled"

                  }

                </div>

                <button
                  className="edit-btn"
                  onClick={()=>
                    editWallet(item)
                  }
                >

                  <Pencil size={18}/>

                </button>

                <button
                  className="delete-btn"
                  onClick={()=>
                    deleteWallet(item.id)
                  }
                >

                  <Trash2 size={18}/>

                </button>

              </div>

            </div>

          ))

        }

      </div>

    </div>

  );

}