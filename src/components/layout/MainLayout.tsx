import { NavLink } from "react-router-dom";
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

export default function MainLayout({ children }) {
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
                <NavLink to="/" className="flex flex-col items-center">
                  <LayoutDashboard />
                  Dashboard
                </NavLink>
                <NavLink
                  to="/exercises"
                  className="flex gap-2 flex-col items-center"
                >
                  <ChartLine />
                  Statistics
                </NavLink>
                <NavLink
                  to="/exercises"
                  className="flex flex-col gap-2 items-center"
                >
                  <Dumbbell />
                  Exercises
                </NavLink>
                <NavLink
                  to="/recipes"
                  className="flex gap-2 flex-col items-center"
                >
                  <Utensils />
                  Recipes
                </NavLink>
              </div>
              <NavLink
                to="/recipes"
                className="flex gap-2 flex-col items-center"
              >
                <Settings />
                Settings
              </NavLink>
            </nav>
          </aside>
          <main className="rounded-ss-sm flex-1 h-full overflow-y-auto bg-white">
            {children}
          </main>
        </div>
      </div>
      <footer className="flex w-full justify-center">
        <nav className="flex gap-8  text-white p-4">
          <NavLink to="/">Legal Notice</NavLink>
          <NavLink to="/exercises">Privacy Policy</NavLink>
          <NavLink to="/recipes">Terms & Conditions</NavLink>
          <NavLink to="/recipes">Cancellation Policy</NavLink>
        </nav>
      </footer>
    </div>
  );
}
