import logo from "@/assets/gymnio-logo.png";

import { LoginForm } from "@/components/login-form";

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
          </div>
        </div>
      </div>
    </div>
  );
}
