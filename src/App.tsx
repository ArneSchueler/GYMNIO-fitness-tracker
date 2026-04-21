import { Routes, Route, Navigate } from "react-router-dom";

// Import der Seiten
import Dashboard from "@/pages/Dashboard";
import ExerciseLibrary from "@/pages/ExerciseLibrary";
import RecipeCatalog from "@/pages/RecipeCatalog";
import MainLayout from "@/components/layout/MainLayout";
import WorkoutSession from "@/pages/WorkoutSession";
import LoginPage from "@/pages/Auth/LoginPage";
import SignupPage from "@/pages/Auth/SignupPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import SettingsPage from "@/pages/SettingsPage";
import FitbitCallback from "./pages/Auth/FitbitCallback";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />
      <Route path="fitbit-callback" element={<FitbitCallback />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workout/:id" element={<WorkoutSession />} />
          <Route path="/statistics" element={<RecipeCatalog />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/recipes" element={<RecipeCatalog />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/legal-notice" element={<RecipeCatalog />} />
          <Route path="/privacy-policy" element={<RecipeCatalog />} />
          <Route path="/terms-conditions" element={<RecipeCatalog />} />
          <Route path="/cancellation-policy" element={<RecipeCatalog />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
