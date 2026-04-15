import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth"; // signOut importiert
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Logout Funktion definieren
  const logout = async () => {
    try {
      await signOut(auth);
      setAccessToken(null);
    } catch (err) {
      console.error("Logout Fehler:", err);
    }
  };

  // GLOBALER BACKGROUND SYNC
  useEffect(() => {
    if (!user || !accessToken) return;

    const syncFitbit = async (type: "heartrate" | "stats") => {
      try {
        const response = await fetch(
          `/api/fitbit-sync?access_token=${accessToken}&type=${type}`,
        );
        if (response.ok) {
          const data = await response.json();
          const today = new Date().toISOString().split("T")[0];

          // FIX: Wir mappen die Felder explizit
          // Dadurch wird der access_token NICHT in Firestore gespeichert
          const updateData: any = {
            userId: user.uid,
            date: today,
            timestamp: serverTimestamp(),
          };

          // Nur existierende Werte übernehmen
          if (data.heartRate !== undefined)
            updateData.heartRate = Number(data.heartRate);
          if (data.steps !== undefined) updateData.steps = Number(data.steps);
          if (data.calories !== undefined)
            updateData.calories = Number(data.calories);
          if (data.workoutTime !== undefined)
            updateData.workoutTime = Number(data.workoutTime);

          await setDoc(
            doc(db, "fitbit_daily_stats", `${user.uid}_${today}`),
            updateData,
            { merge: true },
          );
          console.log(`✅ Fitbit Sync (${type}) erfolgt:`, updateData);
        }
      } catch (err) {
        console.error("Fitbit Sync Fehler:", err);
      }
    };

    // FIX: Herzfrequenz alle 30 Sekunden (30.000ms statt 300.000ms)
    const hrInterval = setInterval(() => syncFitbit("heartrate"), 30000);
    // Stats alle 5 Minuten (300.000ms)
    const statsInterval = setInterval(() => syncFitbit("stats"), 300000);

    return () => {
      clearInterval(hrInterval);
      clearInterval(statsInterval);
    };
  }, [user, accessToken]);

  return (
    <AuthContext.Provider
      value={{ user, loading, accessToken, setAccessToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
