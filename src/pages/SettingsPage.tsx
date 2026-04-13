import { handleFitbitLogin, handleFitbitLogout } from "@/lib/utils";
import { useState } from "react";

export default function SettingsPage() {
  // In a real implementation, you would fetch this from your user's profile database document
  const [isFitbitLinked] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-slate-900 dark:text-slate-100">
      <h1 className="text-3xl font-bold mb-6 text-sky-900">Settings</h1>

      <section className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Connected Accounts</h2>

        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-semibold text-lg">Fitbit</h3>
            <p className="text-sm text-gray-500">
              {isFitbitLinked
                ? "Your Fitbit account is successfully connected."
                : "Connect your Fitbit to sync workouts and health data."}
            </p>
          </div>
          <button
            onClick={isFitbitLinked ? handleFitbitLogout : handleFitbitLogin}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm ${
              isFitbitLinked
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-[#00B0B9] text-white hover:bg-[#0099A1]"
            }`}
          >
            {isFitbitLinked ? "Disconnect" : "Connect Fitbit"}
          </button>
        </div>
      </section>
    </div>
  );
}
