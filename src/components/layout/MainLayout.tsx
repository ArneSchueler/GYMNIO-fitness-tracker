import { useState, useRef } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ButtonIcon } from "../ui/button/ButtonIcon";
import {
  ChartLine,
  Dumbbell,
  LayoutDashboard,
  Menu,
  Settings,
  UserRound,
  Utensils,
  X,
  LogOut,
  Globe,
} from "lucide-react";

import logo from "@/assets/gymnio-logo.png";
import DropDownMenuWithIcon from "../ui/DropDownMenuWithIcon";

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  // This requires a click event on document
  // Basic example, can refactor to own hook
  // Uses useRef and simple event
  // For brevity, handle here
  // But can be improved!
  if (typeof window !== "undefined") {
    window.onclick = (e: MouseEvent) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
  }

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
    <div className="flex bg-sky-900 flex-col w-full h-dvh overflow-hidden">
      <div className="flex font-bold text-lg flex-col w-full flex-1 overflow-hidden">
        <header className="bg-sky-900 text-white items-center px-4 sm:px-6 lg:pr-20 lg:pl-0 h-20 flex w-full">
          <div className="hidden lg:block w-50 shrink-0" aria-hidden />

          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((v) => !v)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
              <img src={logo} alt="gymnio logo" className="h-10 w-auto" />
            </div>

            <div className="flex items-center gap-2">
              {/* Profile dropdown */}
              <DropDownMenuWithIcon />
            </div>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="fixed left-0 top-0 z-50 h-dvh w-72 bg-sky-950 text-white shadow-xl">
              <div className="flex h-20 items-center justify-between px-4">
                <span className="font-bold">Menu</span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X />
                </button>
              </div>

              <nav className="flex h-[calc(100dvh-5rem)] flex-col justify-between gap-10 p-4">
                <div className="flex flex-col gap-8">
                  {primaryLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-2 py-2 ${isActive ? "bg-white/10 text-blue-200" : "text-white"}`
                      }
                    >
                      {l.icon}
                      {l.label}
                    </NavLink>
                  ))}
                </div>

                <div className="flex flex-col gap-8">
                  <NavLink
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-md px-2 py-2 ${isActive ? "bg-white/10 text-blue-200" : "text-white"}`
                    }
                  >
                    <Settings />
                    Settings
                  </NavLink>

                  <div className="pt-4 border-t border-white/10">
                    <nav className="flex flex-col gap-2 text-xs font-medium text-white/60">
                      {footerLinks.map((l) => (
                        <NavLink
                          key={l.to}
                          to={l.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            isActive
                              ? "text-white underline"
                              : "hover:text-white/80"
                          }
                        >
                          {l.label}
                        </NavLink>
                      ))}
                    </nav>
                  </div>
                </div>
              </nav>
            </aside>
          </div>
        )}

        <div className="flex flex-1 min-h-0 overflow-hidden">
          <aside className="hidden lg:block w-50 h-full text-white py-8">
            <nav className="flex flex-col h-full justify-between gap-10 p-4">
              <div className="flex flex-col gap-12">
                {primaryLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      `flex flex-col items-center ${isActive ? "text-blue-500 " : "text-white"}`
                    }
                  >
                    {l.icon}
                    {l.label}
                  </NavLink>
                ))}
              </div>

              <div className="flex flex-col gap-8">
                {/* <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `flex flex-col items-center ${isActive ? "text-blue-500 " : "text-white"}`
                  }
                >
                  <Settings />
                  Settings
                </NavLink> */}

                <div className="pt-4 border-t border-white/10">
                  <nav className="flex flex-col gap-2 text-xs font-medium text-white/60 items-center">
                    {footerLinks.map((l) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        className={({ isActive }) =>
                          isActive
                            ? "text-white underline"
                            : "hover:text-white/80"
                        }
                      >
                        {l.label}
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </div>
            </nav>
          </aside>
          <main className="rounded-ss-sm flex-1 min-h-0 shadow-[inset_0_-2px_10px_rgba(0,0,0,0.5)] overflow-y-auto overflow-x-hidden bg-white">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
