import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSettings } from "../ts/hooks/useSettings";
import { isPassword } from "../ts/utils/Validation";
import { ChannelInfoForm } from "./ChannelInfoForm";
import { PasswordChangeForm } from "./PasswordChangeForm";
import { StreamSettings } from "./StreamSettings";
import { ChannelProps as FormData } from "../ts/types/Channel";
import { PasswordData  } from "../ts/types/Auth";

const SettingsPage: React.FC = () => {
    const { channelInfo, isLoading, error, updateChannelInfo, changePassword } = useSettings();
    const [showStreamKey, setShowStreamKey] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        username: "",
        title: "",
        description: "",
        avatarUrl: "",
        thumbnailUrl: "",
    });

    const [passwordData, setPasswordData] = useState<PasswordData>({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    useEffect(() => {
        if (channelInfo) {
            setFormData({
                username: channelInfo.username,
                title: channelInfo.title,
                description: channelInfo.description,
                avatarUrl: channelInfo.avatarUrl,
                thumbnailUrl: channelInfo.thumbnailUrl,
            });
        }
    }, [channelInfo]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handlePasswordInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setIsUpdating(true);
            setUpdateError(null);
            try {
                await updateChannelInfo(formData);
            } catch (err) {
                setUpdateError("Failed to update channel information. Please try again.");
            } finally {
                setIsUpdating(false);
            }
        },
        [formData, updateChannelInfo]
    );

    const handlePasswordChange = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setIsUpdating(true);
            setUpdateError(null);
            setPasswordChangeSuccess(false);

            if (passwordData.newPassword !== passwordData.confirmNewPassword) {
                setUpdateError("New passwords do not match.");
                setIsUpdating(false);
                return;
            }

            if (!isPassword(passwordData.newPassword)) {
                setUpdateError("New password does not meet the required criteria.");
                setIsUpdating(false);
                return;
            }

            try {
                await changePassword(passwordData.currentPassword, passwordData.newPassword);
                setPasswordChangeSuccess(true);
                setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
            } catch (err) {
                setUpdateError("Failed to change password. Please try again.");
            } finally {
                setIsUpdating(false);
            }
        },
        [passwordData, changePassword]
    );

    const toggleStreamKeyVisibility = useCallback(() => {
        setShowStreamKey((prev) => !prev);
    }, []);

    const memoizedChannelInfoForm = useMemo(
        () => (
            <ChannelInfoForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isUpdating={isUpdating}
                updateError={updateError}
            />
        ),
        [formData, handleInputChange, handleSubmit, isUpdating, updateError]
    );

    const memoizedPasswordChangeForm = useMemo(
        () => (
            <PasswordChangeForm
                passwordData={passwordData}
                handlePasswordInputChange={handlePasswordInputChange}
                handlePasswordChange={handlePasswordChange}
                isUpdating={isUpdating}
                updateError={updateError}
                passwordChangeSuccess={passwordChangeSuccess}
            />
        ),
        [passwordData, handlePasswordInputChange, handlePasswordChange, isUpdating, updateError, passwordChangeSuccess]
    );

    const memoizedStreamSettings = useMemo(
        () => (
            <StreamSettings
                streamKey={channelInfo?.streamKey || ""}
                showStreamKey={showStreamKey}
                toggleStreamKeyVisibility={toggleStreamKeyVisibility}
            />
        ),
        [channelInfo?.streamKey, showStreamKey, toggleStreamKeyVisibility]
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark text-secondary flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg">Loading channel information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-dark text-secondary flex items-center justify-center p-4">
                <div className="bg-red-900 border-l-4 border-red-500 text-secondary p-4 max-w-md w-full" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!channelInfo) {
        return (
            <div className="min-h-screen bg-dark text-secondary flex items-center justify-center p-4">
                <div
                    className="bg-yellow-900 border-l-4 border-yellow-500 text-secondary p-4 max-w-md w-full"
                    role="alert"
                >
                    <p className="font-bold">No Information Available</p>
                    <p>Channel information could not be retrieved. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-dark text-secondary p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-primary">Channel Settings</h1>
                {memoizedChannelInfoForm}
                {memoizedPasswordChangeForm}
                {memoizedStreamSettings}
            </div>
        </div>
    );
};

export default SettingsPage;
