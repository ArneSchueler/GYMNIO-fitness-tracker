import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Import der Seiten
import Dashboard from "@/pages/Dashboard";
import ExerciseLibrary from "@/pages/ExerciseLibrary";
import RecipeCatalog from "@/pages/RecipeCatalog";
import MainLayout from "@/components/layout/MainLayout";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/recipes" element={<RecipeCatalog />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
