import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const api = axios.create({ 
  baseURL: "https://localhost:5514/api", 
  timeout: 5000,
  withCredentials: true
});

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("TOKEN", JSON.stringify(response.data.userDetails.token));
      localStorage.setItem("USERNAME", JSON.stringify(response.data.userDetails.username));
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};