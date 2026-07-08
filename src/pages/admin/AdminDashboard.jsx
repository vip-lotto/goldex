import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

  const navigate = useNavigate();


  function logout(){

    localStorage.removeItem("admin");

    navigate("/admin/login");

  }


  const menus = [
    {
      title: "💰 Deposit",
      path: "/admin/deposit",
      color: "#16a34a9f"
    },
    {
      title: "💸 Withdraw",
      path: "/admin/withdraw",
      color: "#dc2626b7"
    },
    {
      title: "👥 Users",
      path: "/admin/users",
      color: "#2564ebc5"
    },
    {
      title: "📈 Trades",
      path: "/admin/trades",
      color: "#7c3aedb4"
    },
    {
      title: "📑 Orders",
      path: "/admin/orders",
      color: "#ea5a0cb0"
    },
    {
      title: "⚙️ Settings",
      path: "/admin/settings",
      color: "#475569"
    }
  ];


  return (
    <div
      style={{
        minHeight:"100vh",
        background:"#081223",
        color:"#fff",
        padding:30
      }}
    >

      <div
        style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          marginBottom:30
        }}
      >

        <h1>
          GOLDEx Admin Panel
        </h1>


        <button
          onClick={logout}
          style={{
            background:"#09f7eba4",
            color:"#fff",
            border:"none",
            padding:"12px 25px",
            borderRadius:10,
            fontSize:16,
            fontWeight:"bold",
            cursor:"pointer"
          }}
        >
          🚪 Logout
        </button>


      </div>


      <div
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",
          gap:20
        }}
      >

        {menus.map(menu => (

          <div
            key={menu.path}
            onClick={()=>navigate(menu.path)}
            style={{
              background:menu.color,
              padding:30,
              borderRadius:15,
              cursor:"pointer",
              fontSize:22,
              fontWeight:"bold",
              textAlign:"center"
            }}
          >

            {menu.title}

          </div>

        ))}

      </div>


    </div>
  );
}