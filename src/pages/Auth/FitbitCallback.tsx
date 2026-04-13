import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function FitbitCallback() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const processingRef = useRef(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [lastHrSync, setLastHrSync] = useState<Date | null>(null);
  const [lastStatsSync, setLastStatsSync] = useState<Date | null>(null);
  const [hrAnim, setHrAnim] = useState(false);
  const [statsAnim, setStatsAnim] = useState(false);

  const saveToFirestore = async (data: any, uid: string) => {
    const today = new Date().toISOString().split("T")[0];
    const statsDocId = `${uid}_${today}`;

    const safeNumber = (val: any) => {
      if (val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    };

    const updateData: any = { timestamp: serverTimestamp() };
    if (data.calories !== undefined)
      updateData.calories = safeNumber(data.calories);
    if (data.steps !== undefined) updateData.steps = safeNumber(data.steps);
    if (data.heartRate !== undefined)
      updateData.heartRate = safeNumber(data.heartRate);
    if (data.workoutTime !== undefined)
      updateData.workoutTime = safeNumber(data.workoutTime);

    await setDoc(
      doc(db, "fitbit_daily_stats", statsDocId),
      { userId: uid, date: today, ...updateData },
      { merge: true },
    );
  };

  useEffect(() => {
    const fetchFitbitData = async () => {
      const code = searchParams.get("code");
      // Wir rufen den Code-Austausch nur einmal auf
      if (!code || !user || processingRef.current || accessToken) return;

      processingRef.current = true;

      try {
        console.log("Step 1: Requesting initial data via API Proxy...");

        const response = await fetch(
          `/api/fitbit-sync?code=${code}&redirect_uri=${window.location.origin}/fitbit-callback&type=all`,
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch from Fitbit API");
        }

        const data = await response.json();
        setAccessToken(data.access_token);

        console.log("Step 2: Saving live Fitbit data to Firestore...");
        await saveToFirestore(data, user.uid);

        console.log("✅ Live data successfully synced via Proxy!");

        // Aktiviere die Erfolgs-Indikatoren für den ersten Fetch
        setLastHrSync(new Date());
        setLastStatsSync(new Date());
        setHrAnim(true);
        setStatsAnim(true);
        setTimeout(() => setHrAnim(false), 3000);
        setTimeout(() => setStatsAnim(false), 3000);

        // Bereinige die URL, damit der Code beim Neuladen nicht wiederverwendet wird
        window.history.replaceState({}, document.title, "/fitbit-callback");
      } catch (error) {
        console.error("❌ Fitbit Sync Error:", error);
        navigate("/?error=sync_failed");
      }
    };

    fetchFitbitData();
  }, [searchParams, user, navigate, accessToken]);

  // Intervalle fürs Polling
  useEffect(() => {
    if (!accessToken || !user) return;

    // Herzfrequenz alle 1 Minute (60000 ms) abrufen
    const hrInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/fitbit-sync?access_token=${accessToken}&type=heartrate`,
        );
        if (response.ok) {
          const data = await response.json();
          await saveToFirestore(data, user.uid);
          console.log("✅ Heart rate updated!");

          // UI Update triggern
          setLastHrSync(new Date());
          setHrAnim(true);
          setTimeout(() => setHrAnim(false), 3000);
        }
      } catch (error) {
        console.error("Failed to update heart rate:", error);
      }
    }, 60000);

    // Stats alle 5 Minuten (300000 ms) abrufen
    const statsInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/fitbit-sync?access_token=${accessToken}&type=stats`,
        );
        if (response.ok) {
          const data = await response.json();
          await saveToFirestore(data, user.uid);
          console.log("✅ Stats updated!");

          // UI Update triggern
          setLastStatsSync(new Date());
          setStatsAnim(true);
          setTimeout(() => setStatsAnim(false), 3000);
        }
      } catch (error) {
        console.error("Failed to update stats:", error);
      }
    }, 300000);

    return () => {
      clearInterval(hrInterval);
      clearInterval(statsInterval);
    };
  }, [accessToken, user]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-3xl shadow-lg max-w-sm w-[90%] text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-900 border-t-transparent"></div>
        <h2 className="text-xl font-bold text-sky-900">
          Live-Daten werden synchronisiert...
        </h2>
        <p className="text-gray-500 text-sm">
          Deine Daten werden regelmäßig aktualisiert. Du kannst dieses Fenster
          offen lassen.
        </p>

        {/* Status Indikatoren */}
        <div className="w-full mt-2 flex flex-col gap-3 p-4 bg-slate-50 rounded-2xl">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <span className={hrAnim ? "animate-pulse" : ""}>❤️</span>
              <span>Herzfrequenz</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs font-mono">
                {lastHrSync
                  ? lastHrSync.toLocaleTimeString()
                  : "Wird geladen..."}
              </span>
              {hrAnim && <span className="text-green-500 font-bold">✓</span>}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <span className={statsAnim ? "animate-pulse" : ""}>⚡</span>
              <span>Aktivitäten</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs font-mono">
                {lastStatsSync
                  ? lastStatsSync.toLocaleTimeString()
                  : "Wird geladen..."}
              </span>
              {statsAnim && <span className="text-green-500 font-bold">✓</span>}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full px-6 py-2 bg-sky-900 text-white rounded-xl text-sm hover:bg-sky-800 transition-colors"
        >
          Zum Dashboard
        </button>
      </div>
    </div>
  );
}
