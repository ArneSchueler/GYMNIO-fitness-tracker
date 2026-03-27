import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ButtonIcon } from "../ui/button/ButtonIcon";
import {
  ChartLine,
  Dumbbell,
  Globe,
  LayoutDashboard,
  Settings,
  UserRound,
  Utensils,
} from "lucide-react";

import logo from "@/assets/gymnio-logo.png";

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryLinks = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard /> },
    { to: "/statistics", label: "Statistics", icon: <ChartLine /> },
    { to: "/exercises", label: "Exercises", icon: <Dumbbell /> },
    { to: "/recipes", label: "Recipes", icon: <Utensils /> },
  ] as const;

  const footerLinks = [
    { to: "/legal-notice", label: "Legal Notice" },
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/terms-conditions", label: "Terms & Conditions" },
    { to: "/cancellation-policy", label: "Cancellation Policy" },
  ] as const;

  return (
    <div className="flex bg-sky-900  flex-col w-full">
      <div className="flex font-bold text-lg  flex-col w-full overflow-hidden  h-screen max-h-vh">
        <header className="bg-sky-900 text-white items-center px-20 justify-between h-27 flex w-full  ">
          <img src={logo} alt="gymnio logo" />
          <div>
            <ButtonIcon>
              <Globe />
            </ButtonIcon>
            <ButtonIcon>
              <UserRound />
            </ButtonIcon>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <aside className=" w-50 h-full text-white py-8">
            <nav className="flex flex-col h-full justify-between gap-12 p-4">
              <div className="flex flex-col gap-12">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex flex-col items-center ${isActive ? "text-blue-500 " : "text-white"}`
                  }
                >
                  <LayoutDashboard />
                  Dashboard
                </NavLink>
                <NavLink
                  to="/statistics"
                  className={({ isActive }) =>
                    `flex flex-col items-center ${isActive ? "text-blue-500 " : "text-white"}`
                  }
                >
                  <ChartLine />
                  Statistics
                </NavLink>
                <NavLink
                  to="/exercises"
                  className={({ isActive }) =>
                    `flex flex-col items-center ${isActive ? "text-blue-500 " : "text-white"}`
                  }
                >
                  <Dumbbell />
                  Exercises
                </NavLink>
                <NavLink
                  to="/recipes"
                  className={({ isActive }) =>
                    `flex flex-col items-center ${isActive ? "text-blue-500 " : "text-white"}`
                  }
                >
                  <Utensils />
                  Recipes
                </NavLink>
              </div>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex flex-col items-center ${isActive ? "text-blue-500 " : "text-white"}`
                }
              >
                <Settings />
                Settings
              </NavLink>
            </nav>
          </aside>
          <main className="rounded-ss-sm flex-1 min-h-0 shadow-[inset_0_-2px_10px_rgba(0,0,0,0.5)] overflow-y-auto overflow-x-hidden bg-white">
            <Outlet />
          </main>
        </div>
      </div>
      <footer className="flex w-full justify-center">
        <nav className="flex gap-8  text-white p-4">
          <NavLink
            to="/legal-notice"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Legal Notice
          </NavLink>
          <NavLink
            to="/privacy-policy"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Privacy Policy
          </NavLink>
          <NavLink
            to="/terms-conditions"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Terms & Conditions
          </NavLink>
          <NavLink
            to="/cancellation-policy"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Cancellation Policy
          </NavLink>
        </nav>
      </footer>
    </div>
  );
}
