import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // User in Firebase Auth anlegen
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      // Anzeigename im Firebase-Profil speichern
      await updateProfile(user, {
        displayName: formData.name,
      });

      navigate("/"); // Ab zum Dashboard
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, setFormData, error, isLoading, handleSignup };
};
