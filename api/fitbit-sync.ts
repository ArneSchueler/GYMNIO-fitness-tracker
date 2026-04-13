export default async function handler(req: any, res: any) {
  const {
    code,
    redirect_uri,
    access_token: queryToken,
    type = "all",
  } = req.query;

  const clientId = process.env.VITE_FITBIT_CLIENT_ID;
  const clientSecret = process.env.VITE_FITBIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    let access_token = queryToken;

    if (code) {
      // 1. Token Exchange
      const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
        "base64",
      );
      const tokenResponse = await fetch("https://api.fitbit.com/oauth2/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          grant_type: "authorization_code",
          redirect_uri,
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok)
        return res.status(tokenResponse.status).json(tokenData);

      access_token = tokenData.access_token;
    }

    if (!access_token) {
      return res.status(400).json({ error: "Missing code or access_token" });
    }

    const formattedData: any = {};
    const dateStr = new Date().toISOString().split("T")[0];

    // --- 2. STATS (Schritte & Kalorien) ---
    if (type === "all" || type === "stats") {
      const statsResponse = await fetch(
        `https://api.fitbit.com/1/user/-/activities/date/${dateStr}.json`,
        { headers: { Authorization: `Bearer ${access_token}` } },
      );
      const statsData = await statsResponse.json();
      const summary = statsData.summary || {};

      formattedData.steps = summary.steps || 0;
      formattedData.calories = summary.caloriesOut || 0;

      // Workout-Zeit: Wir nehmen hier die Summe aus den Active Zone Minutes, falls vorhanden
      // Das ist genauer als die alten 'Active Minutes'
      formattedData.workoutTime =
        summary.activeZoneMinutes?.value ||
        0 ||
        (summary.fairlyActiveMinutes || 0) + (summary.veryActiveMinutes || 0);
    }

    // --- 3. HEART RATE (Intraday für aktuellen Wert) ---
    if (type === "all" || type === "heartrate") {
      // Wir fragen das 1-Minuten-Detail-Level ab
      const hrResponse = await fetch(
        `https://api.fitbit.com/1/user/-/activities/heart/date/${dateStr}/1d/1min.json`,
        { headers: { Authorization: `Bearer ${access_token}` } },
      );
      const hrData = await hrResponse.json();

      // Ruhepuls als Basis-Fallback
      const restingHR =
        hrData["activities-heart"]?.[0]?.value?.restingHeartRate || 0;

      // Intraday-Daten nach dem aktuellsten Wert durchsuchen
      const intradayEntries =
        hrData["activities-heart-intraday"]?.dataset || [];
      const latestEntry =
        intradayEntries.length > 0
          ? intradayEntries[intradayEntries.length - 1]
          : null;

      // Wenn ein Intraday-Wert (Live-Puls) existiert, nimm diesen, sonst Ruhepuls
      formattedData.heartRate = latestEntry ? latestEntry.value : restingHR;
    }

    console.log("✅ Formatted Data for Frontend:", formattedData);
    res.status(200).json({ ...formattedData, access_token });
  } catch (error: any) {
    console.error("❌ Sync Error:", error);
    res.status(500).json({ error: error.message });
  }
}
