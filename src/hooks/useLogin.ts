import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase"; // Pfad anpassen
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin,
  };
};
