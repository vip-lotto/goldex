import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Pencil,
  MessageCircle
} from "lucide-react";

import { supabase } from "../../lib/supabase";
import "./AdminContact.css";

export default function AdminContact() {

  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [iconFile, setIconFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    link: "",
    enabled: true,
    sort: 1
  });

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {

    setLoading(true);

    const { data, error } = await supabase
      .from("admin_contacts")
      .select("*")
      .order("sort", { ascending: true });

    console.log("LOAD", data);
    console.log("LOAD ERROR", error);

    setContacts(data || []);

    setLoading(false);

  }

  function resetForm() {

    setEditingId(null);

    setIconFile(null);

    setPreview("");

    setForm({
      name: "",
      link: "",
      enabled: true,
      sort: contacts.length + 1
    });

  }

  function editContact(item) {

    setEditingId(item.id);

    setPreview(item.icon_url || "");

    setForm({
      name: item.name,
      link: item.link,
      enabled: item.enabled,
      sort: item.sort
    });

  }

  async function saveContact() {

    console.log("===== SAVE START =====");

    if (!form.name.trim()) {
      alert("Please enter contact name");
      return;
    }

    if (!form.link.trim()) {
      alert("Please enter contact URL");
      return;
    }

    setSaving(true);

    let icon_url = preview;

    if (iconFile) {

      const fileName =
        Date.now() + "_" + iconFile.name;

      const {
        data: uploadData,
        error: uploadError
      } = await supabase.storage
        .from("admin-contact-icons")
        .upload(fileName, iconFile);

      console.log("UPLOAD DATA", uploadData);
      console.log("UPLOAD ERROR", uploadError);

      if (uploadError) {

        alert(uploadError.message);

        setSaving(false);

        return;

      }

      const { data: publicData } =
        supabase.storage
          .from("admin-contact-icons")
          .getPublicUrl(fileName);

      icon_url = publicData.publicUrl;

      console.log("ICON URL", icon_url);

    }

        if (editingId) {

      const {
        data,
        error
      } = await supabase
        .from("admin_contacts")
        .update({

          name: form.name,

          link: form.link,

          enabled: form.enabled,

          sort: form.sort,

          icon_url

        })
        .eq("id", editingId)
        .select();

      console.log("UPDATE DATA", data);
      console.dir(error);

      if (error) {

        console.log(error.message);
        console.log(error.details);
        console.log(error.hint);
        console.log(error.code);

        alert(error.message);

        setSaving(false);

        return;

      }

      alert("Update Success");

    } else {

      const {
        data,
        error
      } = await supabase
        .from("admin_contacts")
        .insert({

          name: form.name,

          link: form.link,

          enabled: form.enabled,

          sort: form.sort,

          icon_url

        })
        .select();

      console.log("INSERT DATA", data);
      console.dir(error);

      if (error) {

        console.log(error.message);
        console.log(error.details);
        console.log(error.hint);
        console.log(error.code);

        alert(error.message);

        setSaving(false);

        return;

      }

      alert("Save Success");

    }

    resetForm();

    await loadContacts();

    setSaving(false);

  }

    async function deleteContact(id) {

    const ok = window.confirm(
      "Delete this contact?"
    );

    if (!ok) return;

    const { error } = await supabase
      .from("admin_contacts")
      .delete()
      .eq("id", id);

    console.dir(error);

    if (error) {

      alert(error.message);

      return;

    }

    alert("Delete Success");

    await loadContacts();

  }

  return (

    <div className="admin-contact-page">

      <div className="admin-contact-header">

        <button
          className="back-btn"
          onClick={() => navigate("/admin")}
        >

          <ArrowLeft size={20} />

          Back

        </button>

        <h1>

          Contact Admin

        </h1>

      </div>

      <div className="contact-form">

        <div className="form-group">

          <label>

            Contact Name

          </label>

          <input
            value={form.name}
            onChange={(e)=>

              setForm({

                ...form,

                name:e.target.value

              })

            }
            placeholder="LINE Official"
          />

        </div>

        <div className="form-group">

          <label>

            Contact URL

          </label>

          <input
            value={form.link}
            onChange={(e)=>

              setForm({

                ...form,

                link:e.target.value

              })

            }
            placeholder="https://line.me/..."
          />

        </div>

        <div className="form-group">

          <label>

            Display Order

          </label>

          <input
            type="number"
            value={form.sort}
            onChange={(e)=>

              setForm({

                ...form,

                sort:Number(e.target.value)

              })

            }
          />

        </div>

        <div className="form-group">

          <label>

            Upload Icon

          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e)=>{

              const file =
              e.target.files?.[0];

              if(!file) return;

              setIconFile(file);

              setPreview(
                URL.createObjectURL(file)
              );

            }}
          />

        </div>

        {

          preview &&

          <img
            src={preview}
            alt=""
            className="preview-image"
          />

        }

        <label className="switch">

          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e)=>

              setForm({

                ...form,

                enabled:e.target.checked

              })

            }
          />

          Enable Contact

        </label>

        <div className="form-buttons">

          <button
            className="save-btn"
            onClick={saveContact}
            disabled={saving}
          >

            <Save size={18}/>

            {

              saving

              ?

              "Saving..."

              :

              editingId

              ?

              "Update"

              :

              "Save"

            }

          </button>

          <button
            className="reset-btn"
            onClick={resetForm}
          >

            <Plus size={18}/>

            New

          </button>

        </div>

      </div>

            <div className="contact-list">

        <h2>

          <MessageCircle size={22} />

          Contact List

        </h2>

        {

          loading

          ?

          <div className="loading">

            Loading...

          </div>

          :

          contacts.length === 0

          ?

          <div className="loading">

            No Contact

          </div>

          :

          contacts.map(item => (

            <div
              key={item.id}
              className="contact-card"
            >

              <div className="contact-left">

                <img
                  src={item.icon_url}
                  alt=""
                  className="contact-icon"
                />

                <div>

                  <h3>

                    {item.name}

                  </h3>

                  <p>

                    {item.link}

                  </p>

                  <span>

                    Order : {item.sort}

                  </span>

                </div>

              </div>

              <div className="contact-right">

                <div
                  className={
                    item.enabled
                      ? "status on"
                      : "status off"
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
                  onClick={() =>
                    editContact(item)
                  }
                >

                  <Pencil size={18} />

                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteContact(item.id)
                  }
                >

                  <Trash2 size={18} />

                </button>

              </div>

            </div>

          ))

        }

      </div>

    </div>

  );

}