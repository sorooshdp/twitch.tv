import { useState, useEffect } from "react";
import axios from "axios";

interface ChannelInfo {
    id: string;
    username: string;
    title: string;
    description: string;
    avatarUrl: string;
    streamKey: string;
}

export const useChannelInfo = () => {
    const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChannelInfo = async () => {
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
        };

        fetchChannelInfo();
    }, []);

    return { channelInfo, isLoading, error };
};
