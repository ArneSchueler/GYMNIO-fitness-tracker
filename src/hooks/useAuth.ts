// hooks/useAuth.ts
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();

  const logout = () => {
    // 1. Daten löschen
    localStorage.removeItem("token");
    // 2. Globalen State zurücksetzen (falls vorhanden)
    // setUserName(null);

    // 3. Umleitung
    navigate("/login");
  };

  return { logout };
};
