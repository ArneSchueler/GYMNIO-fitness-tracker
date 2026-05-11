import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, type User, signOut } from "firebase/auth"; // signOut importiert
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => Promise<void>;
  syncFitbit: (type: "all" | "heartrate" | "stats") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    return localStorage.getItem("fitbit_access_token");
  });

  const setAccessToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("fitbit_access_token", token);
    } else {
      localStorage.removeItem("fitbit_access_token");
    }
    setAccessTokenState(token);
  };

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

  const syncFitbit = useCallback(async (type: "all" | "heartrate" | "stats") => {
    if (!user || !accessToken) return;
    try {
      const response = await fetch(
        `/api/fitbit-sync?access_token=${accessToken}&type=${type}`,
      );
      if (response.ok) {
        const data = await response.json();
        const today = new Date().toISOString().split("T")[0];

        const updateData: any = {
          userId: user.uid,
          date: today,
          timestamp: serverTimestamp(),
        };

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
      } else if (response.status === 401) {
        // Token might be expired, clear it
        setAccessToken(null);
      }
    } catch (err) {
      console.error("Fitbit Sync Fehler:", err);
    }
  }, [user, accessToken]);

  // GLOBALER BACKGROUND SYNC
  useEffect(() => {
    if (!user || !accessToken) return;

    // Trigger initial sync on mount or token change
    syncFitbit("all");

    // Herzfrequenz alle 30 Sekunden (30.000ms statt 300.000ms)
    const hrInterval = setInterval(() => syncFitbit("heartrate"), 30000);
    // Stats alle 5 Minuten (300.000ms)
    const statsInterval = setInterval(() => syncFitbit("stats"), 300000);

    return () => {
      clearInterval(hrInterval);
      clearInterval(statsInterval);
    };
  }, [user, accessToken, syncFitbit]);

  return (
    <AuthContext.Provider
      value={{ user, loading, accessToken, setAccessToken, logout, syncFitbit }}
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
