import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function FitbitCallback() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const processingRef = useRef(false);

  useEffect(() => {
    const fetchFitbitData = async () => {
      const code = searchParams.get("code");
      if (!code || !user || processingRef.current) return;

      processingRef.current = true;

      try {
        console.log(
          "Step 1: Requesting data via API Proxy (to bypass CORS)...",
        );

        // Wir rufen unsere eigene API-Route auf, die wir im nächsten Schritt erstellen
        // Diese Route übernimmt den Token-Tausch und die Fitbit-Abfrage auf Server-Ebene
        const response = await fetch(
          `/api/fitbit-sync?code=${code}&redirect_uri=${window.location.origin}/fitbit-callback`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch from Fitbit API");
        }

        const data = await response.json();

        // Step 2: Daten für Firestore vorbereiten
        const today = new Date().toISOString().split("T")[0];
        const statsDocId = `${user.uid}_${today}`;

        console.log("Step 3: Saving live Fitbit data to Firestore...");

        await setDoc(
          doc(db, "fitbit_daily_stats", statsDocId),
          {
            userId: user.uid,
            date: today,
            calories: Number(data.calories),
            steps: Number(data.steps),
            heartRate: Number(data.heartRate),
            workoutTime: Number(data.workoutTime),
            timestamp: serverTimestamp(),
          },
          { merge: true },
        );

        console.log("✅ Live data successfully synced via Proxy!");
        navigate("/");
      } catch (error) {
        console.error("❌ Fitbit Sync Error:", error);
        // Optional: Error State anzeigen oder zum Dashboard mit Fehler-Flag
        navigate("/?error=sync_failed");
      }
    };

    fetchFitbitData();
  }, [searchParams, user, navigate]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-3xl shadow-lg">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-900 border-t-transparent"></div>
        <h2 className="text-xl font-bold text-sky-900">
          Live-Daten werden geladen...
        </h2>
        <p className="text-gray-500 text-sm">
          Wir umgehen die CORS-Sperre und holen deine Daten.
        </p>
      </div>
    </div>
  );
}
