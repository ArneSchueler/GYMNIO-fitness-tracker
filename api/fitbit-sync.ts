import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code, redirect_uri } = req.query;

  if (!code) return res.status(400).json({ error: "No code provided" });

  const clientID = process.env.VITE_FITBIT_CLIENT_ID;
  const clientSecret = process.env.VITE_FITBIT_CLIENT_SECRET;
  const authHeader = Buffer.from(`${clientID}:${clientSecret}`).toString(
    "base64",
  );

  try {
    // 1. Token Exchange
    const tokenResponse = await fetch("https://api.fitbit.com/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: redirect_uri as string,
        client_id: clientID!,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.errors) throw new Error(tokenData.errors[0].message);

    // 2. Daten von Fitbit holen
    const statsResponse = await fetch(
      "https://api.fitbit.com/1/user/-/activities/date/today.json",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );
    const statsData = await statsResponse.json();

    const hrResponse = await fetch(
      "https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );
    const hrData = await hrResponse.json();

    // 3. Daten zurück an das Frontend geben
    return res.status(200).json({
      steps: statsData.summary.steps || 0,
      calories: statsData.summary.caloriesOut || 0,
      heartRate: hrData["activities-heart"]?.[0]?.value?.restingHeartRate || 0,
      workoutTime: statsData.summary.veryActiveMinutes || 0,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
