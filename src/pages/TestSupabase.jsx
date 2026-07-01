import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function TestSupabase() {

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {

    const { data, error } =
      await supabase
        .from("profiles")
        .select("*");

    console.log("DATA =", data);
    console.log("ERROR =", error);
  };

  return (
    <h1 style={{color:"white"}}>
      Supabase Connected
    </h1>
  );
}