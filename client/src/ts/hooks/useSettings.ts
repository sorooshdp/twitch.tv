import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface ChannelInfo {
    id: string;
    username: string;
    title: string;
    description: string;
    avatarUrl: string;
    streamKey: string;
    thumbnailUrl : string;
}

interface UpdateChannelInfoParams {
    username: string;
    title: string;
    description: string;
    avatarUrl: string;
    thumbnailUrl: string;
}

export const useSettings = () => {
    const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchChannelInfo = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("https://localhost:5514/api/settings/channel", {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("TOKEN")!)}`,
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

    const updateChannelInfo = useCallback(async (updatedInfo: UpdateChannelInfoParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.put(
                "https://localhost:5514/api/settings/channel",
                updatedInfo,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("TOKEN")!)}`,
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
                "https://localhost:5514/api/settings/password",
                { password: currentPassword, newPassword },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("TOKEN")!)}`,
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
