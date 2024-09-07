import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ChannelProps as ChannelInfo } from "../types/Channel";

export const useSettings = () => {
    const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchChannelInfo = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("https://twitch-tv-server.vercel.app/api/settings/channel", {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("TOKEN")!)}`,
                },
            });
            setChannelInfo(response.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || "An error occurred while fetching channel information");
            } else {
                setError("An unexpected error occurred");
            }
            console.error("Error fetching channel info:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChannelInfo();
    }, [fetchChannelInfo]);

    const updateChannelInfo = useCallback(async (updatedInfo: ChannelInfo) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.put(
                "https://twitch-tv-server.vercel.app/api/settings/channel",
                updatedInfo,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("TOKEN")!)}`,
                    },
                }
            );
            setChannelInfo(prevInfo => ({ ...prevInfo, ...response.data }));
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || "An error occurred while updating channel information");
            } else {
                setError("An unexpected error occurred");
            }
            console.error("Error updating channel info:", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.patch(
                "https://twitch-tv-server.vercel.app/api/settings/password",
                { password: currentPassword, newPassword },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("TOKEN")!)}`,
                    },
                }
            );
            return response.data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || "An error occurred while changing the password");
            } else {
                setError("An unexpected error occurred");
            }
            console.error("Error changing password:", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { channelInfo, isLoading, error, updateChannelInfo, changePassword };
};
