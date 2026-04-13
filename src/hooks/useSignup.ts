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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Account erstellen
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      // 2. Profil mit dem vollen Namen ("Full Name") aktualisieren
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: formData.name,
        });
      }

      // 3. Erst nach Erfolg navigieren
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    error,
    isLoading: isSubmitting,
    handleSignup,
  };
};
