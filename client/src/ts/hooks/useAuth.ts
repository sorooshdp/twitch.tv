import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../types/Auth";

export const api = axios.create({
    baseURL: "https://twitch-tv-server.vercel.app/api",
    timeout: 5000,
    withCredentials: true,
});

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAuth = async (endpoint: string, data: AuthData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response: AxiosResponse = await api.post(endpoint, data);
            const { token, username } = response.data.userDetails;

            sessionStorage.setItem("TOKEN", JSON.stringify(token));
            sessionStorage.setItem("USERNAME", JSON.stringify(username));
            navigate("/dashboard/channels");
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const login = (email: string, password: string) => handleAuth("/auth/login", { email, password, username: "" });
    const signup = (username: string, email: string, password: string) =>
        handleAuth("/auth/signup", { username, email, password });

    return { login, signup, isLoading, error };
};
