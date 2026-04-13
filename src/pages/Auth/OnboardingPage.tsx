import { handleFitbitLogin } from "@/lib/utils";
import { Link } from "react-router-dom";
import logo from "@/assets/gymnio-logo.png";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
        <img src={logo} alt="Gymnio Logo" className="h-16 mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-sky-900">
          Welcome to Gymnio!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          To get the most out of your smarter training journey, connect your
          fitness tracker right away.
        </p>

        <button
          onClick={handleFitbitLogin}
          className="flex w-full items-center justify-center gap-3 rounded-md bg-[#00B0B9] px-4 py-3 text-md font-semibold text-white shadow-sm hover:bg-[#0099A1] transition-colors mb-4"
        >
          Connect Fitbit
        </button>

        <Link
          to="/"
          className="block w-full text-center text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 mt-2"
        >
          Skip for now
        </Link>
      </div>
    </div>
  );
}
