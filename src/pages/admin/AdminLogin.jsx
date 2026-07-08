import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./admin.css";


export default function AdminLogin(){

  const navigate = useNavigate();


  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");

  const [loading,setLoading] = useState(false);



  async function login(){


    if(!username || !password){

      alert("กรุณากรอก Username และ Password");

      return;

    }


    setLoading(true);



    try{


      const { data, error } = await supabase

        .from("admin_users")

        .select("*")

        .eq("username", username.trim())

        .eq("password", password.trim())

        .maybeSingle();



      console.log(
        "ADMIN DATA:",
        data
      );


      console.log(
        "ADMIN ERROR:",
        error
      );



      if(error){

        alert(error.message);

        setLoading(false);

        return;

      }



      if(!data){

        alert(
          "Username หรือ Password ผิด"
        );

        setLoading(false);

        return;

      }



      localStorage.setItem(
        "admin",
        JSON.stringify(data)
      );



      navigate("/admin");



    }catch(err){


      console.log(err);


      alert(
        "Login Error"
      );


    }


    setLoading(false);


  }





  return (

    <div className="admin-login">


      <div className="login-box">


        <h1>
          TRUST Admin
        </h1>



        <input

          type="text"

          placeholder="Username"

          value={username}

          onChange={(e)=>
            setUsername(e.target.value)
          }

        />




        <input

          type="password"

          placeholder="Password"

          value={password}

          onChange={(e)=>
            setPassword(e.target.value)
          }

        />




        <button

          onClick={login}

          disabled={loading}

        >

          {
            loading
            ?
            "CHECKING..."
            :
            "LOGIN"
          }


        </button>



      </div>


    </div>

  );


}