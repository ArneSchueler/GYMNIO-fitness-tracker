import { db } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const CLIENT_ID = import.meta.env.VITE_FITBIT_CLIENT_ID;
// HINWEIS: Das Secret sollte eigentlich im Backend liegen,
// für dein lokales MVP nutzen wir es hier, falls vorhanden.
const REDIRECT_URI = window.location.origin + "/auth/fitbit/callback";

export const syncFitbitDataWithFirestore = async (
  code: string,
  userId: string,
) => {
  try {
    // 1. Token-Tausch (OAuth2)
    // Hinweis: Manche Setups brauchen hier eine Proxy oder Backend-Route wegen CORS
    console.log("Exchange code for token...");

    // 2. Mock oder Echte API-Abfrage
    // Da wir im Frontend sind, simulieren wir hier den Empfang
    // und das anschließende Schreiben in die DB.

    const today = new Date().toISOString().split("T")[0];
    const docId = `${userId}_${today}`;

    // Hier setzen wir die Daten so, wie dein Dashboard sie braucht (als NUMBER)
    await setDoc(
      doc(db, "fitbit_daily_stats", docId),
      {
        userId: userId,
        date: today,
        steps: 0, // Hier kommen die echten Werte aus dem API Call rein
        calories: 0,
        heartRate: 0,
        workoutTime: 0,
        timestamp: serverTimestamp(),
      },
      { merge: true },
    );

    console.log("✅ Firestore Dokument erstellt/aktualisiert!");
    return true;
  } catch (error) {
    console.error("❌ Fehler im FitbitService:", error);
    return false;
  }
};
