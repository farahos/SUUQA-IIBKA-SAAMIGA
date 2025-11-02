// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, BarChart2, LogOut } from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // kaliya admin ayuu muujiyaa sidebar-ka
  if (!user || user.role !== "admin") return "No Access";

  const linkClasses = (path) =>
    `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
      location.pathname === path
        ? "bg-indigo-600 text-white"
        : "text-gray-100 hover:bg-indigo-600 hover:text-white"
    }`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-54 bg-blue-600 text-white py-3  font-bold text-lg hover:from-purple-500 hover:to-indigo-500  shadow-lg flex flex-col">
      {/* Title */}
      <div className="p-4 border-b border-indigo-400">
        <h1 className="text-2xl font-bold text-white">{ "Welcome " +user.username}</h1>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 mt-4 space-y-2">
        <Link to="/admin-dashboard" className={linkClasses("/admin-dashboard")}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link to="/manage" className={linkClasses("/manage")}>
          <Users size={20} />
          <span>Request Buyer </span>
        </Link>

        <Link to="/SellerManagement" className={linkClasses("/SellerManagement")}>
          <BookOpen size={20} />
          <span>Share Manage</span>
        </Link>

        <Link to="/RequestBuyer" className={linkClasses("/RequestBuyer")}>
          <BarChart2 size={20} />
          <span>Manage Users</span>
        </Link>
      </nav>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="m-4 flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-100 hover:bg-red-600 hover:text-white transition-colors"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
