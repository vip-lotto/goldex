import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminContacts() {

  const [contacts, setContacts] = useState([]);

  const loadContacts = async () => {

    const { data, error } = await supabase
      .from("admin_contacts")
      .select("*")
      .order("sort", { ascending: true });

    if (error) {
      console.log(error);
      return;
    }

    setContacts(data || []);

  };

  useEffect(() => {
    loadContacts();
  }, []);

  return (

    <div style={{ padding: 20 }}>

      <h2>Admin Contacts</h2>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >

        <thead>

          <tr>

            <th>ID</th>
            <th>Name</th>
            <th>Link</th>
            <th>Enabled</th>

          </tr>

        </thead>

        <tbody>

          {contacts.map((item) => (

            <tr key={item.id}>

              <td>{item.id}</td>

              <td>{item.name}</td>

              <td>{item.link}</td>

              <td>
                {item.enabled ? "✅" : "❌"}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}