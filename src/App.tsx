import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Import der Seiten
import Dashboard from "@/pages/Dashboard";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import RecipeCatalog from "@/pages/RecipeCatalog";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Temporäres Menü zum Testen (bevor wir die echte Navbar bauen) */}
        <nav className="flex gap-4 p-4 border-b bg-muted/40">
          <Link to="/">Dashboard</Link>
          <Link to="/exercises">Exercises</Link>
          <Link to="/recipes">Recipes</Link>
        </nav>

        {/* Hier werden die Inhalte dynamisch ausgetauscht */}
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exercises" element={<ExerciseLibrary />} />
            <Route path="/recipes" element={<RecipeCatalog />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
