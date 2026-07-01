import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminSettings() {

  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {

    const { data, error } = await supabase
      .from("trade_settings")
      .select("*")
      .order("duration", { ascending: false });

    if (!error) {

      setSettings(data || []);

    }

    setLoading(false);

  }

  async function save(item) {

    const { error } = await supabase

      .from("trade_settings")

      .update({

        duration: item.duration,

        payout: item.payout,

        minimum: item.minimum,

        enabled: item.enabled,

      })

      .eq("id", item.id);

    if (!error) {

      alert("Saved");

      loadSettings();

    }

  }

  return (

    <div className="admin-page">

      <h2>

        Trade Settings

      </h2>

      {loading ? (

        <p>

          Loading...

        </p>

      ) : (

        <table className="admin-table">

          <thead>

            <tr>

              <th>Minute</th>

              <th>Payout %</th>

              <th>Minimum</th>

              <th>Status</th>

              <th></th>

            </tr>

          </thead>

          <tbody>

            {settings.map(item=>(

              <tr key={item.id}>

                <td>

                  <input

                    value={item.duration}

                    type="number"

                    onChange={(e)=>{

                      item.duration=

                      Number(e.target.value);

                      setSettings([...settings]);

                    }}

                  />

                </td>

                <td>

                  <input

                    value={item.payout}

                    type="number"

                    onChange={(e)=>{

                      item.payout=

                      Number(e.target.value);

                      setSettings([...settings]);

                    }}

                  />

                </td>

                <td>

                  <input

                    value={item.minimum}

                    type="number"

                    onChange={(e)=>{

                      item.minimum=

                      Number(e.target.value);

                      setSettings([...settings]);

                    }}

                  />

                </td>

                <td>

                  <input

                    checked={item.enabled}

                    type="checkbox"

                    onChange={(e)=>{

                      item.enabled=

                      e.target.checked;

                      setSettings([...settings]);

                    }}

                  />

                </td>

                <td>

                  <button

                    onClick={()=>save(item)}

                  >

                    Save

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}