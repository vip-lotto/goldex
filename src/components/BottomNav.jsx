import { Link, useLocation } from "react-router-dom";
import {
  House,
  ChartCandlestick,
  ArrowLeftRight,
  Wallet,
  User
} from "lucide-react";

export default function BottomNav() {

  const location = useLocation();

  if (
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null;
  }

  const activeColor = "#F5C542";
  const normalColor = "#ffffff";

  const navStyle = (path) => ({
    color: location.pathname === path ? activeColor : normalColor,
    textDecoration: "none",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    transition: ".25s",
    fontWeight: location.pathname === path ? "700" : "500"
  });

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "68px",
        background: "#111111",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        borderTop: "1px solid #262626",
        zIndex: 999
      }}
    >

      <Link to="/home" style={navStyle("/home")}>
        <House size={22}/>
        <span>Home</span>
      </Link>

      <Link to="/market" style={navStyle("/market")}>
        <ChartCandlestick size={22}/>
        <span>Market</span>
      </Link>

      <Link to="/trade" style={navStyle("/trade")}>
        <ArrowLeftRight size={22}/>
        <span>Trade</span>
      </Link>

      

      <Link to="/assets" style={navStyle("/assets")}>
        <Wallet size={22}/>
        <span>Assets</span>
      </Link>

      <Link to="/mine" style={navStyle("/mine")}>
      <User size={22}/>
      <span>Mine</span>
      </Link>

    </div>
  );
}