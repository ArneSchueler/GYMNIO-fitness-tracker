import logo from "@/assets/gymnio-logo.png";

import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="relative hidden bg-orange-500 lg:flex lg:flex-col gap-[50%] px-12 items-center pbs-12 pbe-auto ">
        <img src={logo} alt="Gymnio Logo" />
        <div className="text-white text-center flex flex-col gap-4">
          <h3 className="text-2xl font-bold">
            Create your account – start your smarter training journey today{" "}
          </h3>
          <p>
            Track your workouts, monitor your progress, and get AI-powered
            coaching – all in one place.
          </p>
        </div>
      </div>
      <div className="flex flex-col col-span-2 gap-4 p-6 md:p-10">
        <div className="flex flex-1  items-center justify-center">
          <div className="w-full max-w-sm">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
