import { useNavigate } from "react-router-dom";
import {
  Users,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  CandlestickChart,
  Landmark,
  MessageCircle,
  Settings,
  LogOut,
  ShieldCheck,
  BarChart3,
  DollarSign,
  TrendingUp,
  Activity,
  BadgeCheck
} from "lucide-react";

import "./AdminDashboard.css";

export default function AdminDashboard() {

  const navigate = useNavigate();

  function logout() {

    localStorage.removeItem("admin");

    navigate("/admin/login");

  }

  const menus = [

    {
      title: "Deposit",
      desc: "Approve customer deposits",
      icon: <ArrowDownCircle size={34}/>,
      path: "/admin/deposit",
      color: "green"
    },

    {
      title: "Withdraw",
      desc: "Approve withdrawals",
      icon: <ArrowUpCircle size={34}/>,
      path: "/admin/withdraw",
      color: "red"
    },

    {
      title: "Users",
      desc: "Manage all users",
      icon: <Users size={34}/>,
      path: "/admin/users",
      color: "blue"
    },

    {
      title: "Manual Deposit",
      desc: "Add balance manually",
      icon: <DollarSign size={34}/>,
      path: "/admin/manual-deposit",
      color: "cyan"
    },

    {
      title: "Trades",
      desc: "Trade management",
      icon: <CandlestickChart size={34}/>,
      path: "/admin/trades",
      color: "purple"
    },

    {
      title: "Deposit Wallet",
      desc: "Wallet Address & QR",
      icon: <Wallet size={34}/>,
      path: "/admin/deposit-wallet",
      color: "orange"
    },

    {
      title: "Admin Contact",
      desc: "LINE / Telegram",
      icon: <MessageCircle size={34}/>,
      path: "/admin/contact",
      color: "pink"
    },

    {
    title:"KYC Verification",
    desc:"Approve customer identity",
    icon:<BadgeCheck size={34}/>,
    path:"/admin/kyc",
    color:"green"
    },

    {
    title: "Support Chat",
    desc: "Chat with customers",
    icon: <MessageCircle size={34}/>,
    path: "/admin/support-chat",
    color: "blue"
    },

    {
      title: "Settings",
      desc: "System settings",
      icon: <Settings size={34}/>,
      path: "/admin/settings",
      color: "gray"
    },

    {
  title: "Add Admin",
  desc: "Administrator Account",
  icon: <ShieldCheck size={34} />,
  path: "/admin/admin-accounts",
  color: "indigo"
},
    {
    title:"📞 Contact Admin",
    path:"/admin/contact",
    color:"#06b6d4"
}

  ];

  return (

<div className="admin-page">

    {/* ================= Header ================= */}

    <div className="admin-header">

        <div>

            <h1>Trust Admin</h1>

            <p>Exchange Management System</p>

        </div>

        <button
            className="logout-btn"
            onClick={logout}
        >
            <LogOut size={18}/>
            Logout
        </button>

    </div>

    {/* ================= Welcome ================= */}

    <div className="welcome-card">

        <div className="welcome-left">

            <div className="admin-avatar">

                <ShieldCheck size={42}/>

            </div>

            <div>

                <h2>Administrator</h2>

                <span>Full Access Control</span>

            </div>

        </div>

        <div className="welcome-right">

            <Activity size={38}/>

        </div>

    </div>

    {/* ================= Statistics ================= */}

    <div className="stats-grid">

        <div className="stat-card">

            <BarChart3 size={30}/>

            <div>

                <h3>Dashboard</h3>

                <span>Overview</span>

            </div>

        </div>

        <div 
            className="stat-card"
            onClick={()=>navigate("/admin/trades")}
            style={{cursor:"pointer"}}
        >

            <TrendingUp size={30}/>

            <div>

                <h3>Trading</h3>

                <span>Manage Orders</span>

            </div>

        </div>

        <div className="stat-card">

            <Wallet size={30}/>

            <div>

                <h3>Wallet</h3>

                <span>Deposit Address</span>

            </div>

        </div>

    </div>

    {/* ================= Menu ================= */}

    <div className="menu-grid">

        {menus.map(menu=>(

            <div
                key={menu.path}
                className={`menu-card ${menu.color}`}
                onClick={()=>navigate(menu.path)}
            >

                <div className="menu-icon">

                    {menu.icon}

                </div>

                <h3>

                    {menu.title}

                </h3>

                <p>

                    {menu.desc}

                </p>

            </div>

        ))}

    </div>

</div>

);
}