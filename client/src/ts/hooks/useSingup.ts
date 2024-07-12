import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";

type CustomError = {
  error: true;
  e: unknown;
};

const api = axios.create({ 
  baseURL: "https://localhost:5514/api", 
  timeout: 5000,
  withCredentials: true
});

const signupReq = async (data: { [key: string]: string }): Promise<AxiosResponse | CustomError> => {
  try {
    return await api.post("auth/signup", data); 
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await signupReq({ username, email, password });
      setIsLoading(false);
      
      if ('error' in res) {
        setError('An error occurred during signup');
        console.error(res.e);
        return;
      }
      
      const { userData } = res.data;
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/");
    } catch (e) {
      setIsLoading(false);
      setError('An unexpected error occurred');
      console.error(e);
    }
  };

  return {
    signup,
    isLoading,
    error,
  };
};