// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { signOut, onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase"; // Importiere deine Auth-Instanz
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>; // Logout-Funktion im Interface ergänzen
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      console.log("Logout gestartet..."); // Debugging-Hilfe
      await signOut(auth);
      // Firebase onAuthStateChanged triggert automatisch und setzt user auf null
      console.log("Firebase erfolgreich abgemeldet");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
    }
  };

  useEffect(() => {
    // Überwacht den Login-Status (Firebase-Magie)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {" "}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Eigener Hook für einfacheren Zugriff
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth muss innerhalb eines AuthProviders verwendet werden",
    );
  }
  return context;
};
