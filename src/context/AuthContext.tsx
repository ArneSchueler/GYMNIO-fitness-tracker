// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
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

          // Speichern in Firestore triggert automatisch das Dashboard via onSnapshot
          await setDoc(
            doc(db, "fitbit_daily_stats", `${user.uid}_${today}`),
            {
              userId: user.uid,
              date: today,
              ...data,
              timestamp: serverTimestamp(),
            },
            { merge: true },
          );
          console.log(`✅ Fitbit Sync (${type}) erfolgt.`);
        }
      } catch (err) {
        console.error("Fitbit Sync Fehler:", err);
      }
    };

    // Herzfrequenz alle 30 Sekunden (Wunsch)
    const hrInterval = setInterval(() => syncFitbit("heartrate"), 300000);
    // Stats alle 5 Minuten (schont API Limit)
    const statsInterval = setInterval(() => syncFitbit("stats"), 300000);

    return () => {
      clearInterval(hrInterval);
      clearInterval(statsInterval);
    };
  }, [user, accessToken]);

  return (
    <AuthContext.Provider
      value={{ user, loading, accessToken, setAccessToken }}
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
