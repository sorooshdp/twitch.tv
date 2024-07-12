import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";

type CustomError = {
  error: true;
  e: unknown;
};

const loginReq = async (data: { [key: string]: string }): Promise<AxiosResponse | CustomError> => {
  try {
    return await axios.create({ baseURL: "http://localhost:5514/api", timeout: 1000 }).post("auth/login", data);
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await loginReq({ email, password });
    setIsLoading(false);
    
    if ('error' in res) {
      return console.log(res.e);
    }
    
    const { userData } = res.data;
    localStorage.setItem("user", JSON.stringify(userData));
    navigate("/");
  };

  return {
    login,
    isLoading,
  };
};