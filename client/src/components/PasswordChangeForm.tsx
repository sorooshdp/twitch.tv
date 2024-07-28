import React from "react";

interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

interface PasswordChangeFormProps {
    passwordData: PasswordData;
    handlePasswordInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePasswordChange: (e: React.FormEvent) => Promise<void>;
    isUpdating: boolean;
    updateError: string | null;
    passwordChangeSuccess: boolean;
}

export const PasswordChangeForm: React.FC<PasswordChangeFormProps> = React.memo(
    ({
        passwordData,
        handlePasswordInputChange,
        handlePasswordChange,
        isUpdating,
        updateError,
        passwordChangeSuccess,
    }) => (
        <form
            onSubmit={handlePasswordChange}
            className="bg-[#0D1B1E] rounded-lg p-6 mb-8 shadow-lg backdrop-blur-sm bg-opacity-50"
        >
            <h2 className="text-2xl font-semibold mb-6 text-primary">Change Password</h2>
            <div className="space-y-4">
                {(["currentPassword", "newPassword", "confirmNewPassword"] as const).map((field) => (
                    <div key={field}>
                        <label className="block text-secondary text-sm font-bold mb-2" htmlFor={field}>
                            {field.split(/(?=[A-Z])/).join(" ")}
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-dark border-primary text-secondary"
                            id={field}
                            name={field}
                            type="password"
                            value={passwordData[field]}
                            onChange={handlePasswordInputChange}
                            required
                        />
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <button
                    type="submit"
                    className="bg-primary text-dark font-bold py-2 px-4 rounded hover:bg-primary-dark transition-colors"
                    disabled={isUpdating}
                >
                    {isUpdating ? "Changing Password..." : "Change Password"}
                </button>
            </div>
            {updateError && <div className="mt-4 text-red-500">{updateError}</div>}
            {passwordChangeSuccess && <div className="mt-4 text-green-500">Password changed successfully!</div>}
        </form>
    )
);
