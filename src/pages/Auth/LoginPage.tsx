import logo from "@/assets/gymnio-logo.png";

import { LoginForm } from "@/components/login-form";
import { handleFitbitLogin } from "@/lib/utils";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="relative hidden bg-cyan-900 lg:flex lg:flex-col gap-[50%] px-12 items-center pbs-12 pbe-auto ">
        <img src={logo} alt="Gymnio Logo" />
        <div className="text-white text-center flex flex-col gap-4">
          <h3 className="text-2xl font-bold">
            Welcome back to your fitness journey
          </h3>
          <p>
            Track your progress, stay motivated, and let Gymnio guide you every
            step of the way. Your next workout is waiting for you.
          </p>
        </div>
      </div>
      <div className="flex flex-col col-span-2 gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500 dark:bg-gray-950">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleFitbitLogin}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#00B0B9] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0099A1] transition-colors"
            >
              Fitbit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
