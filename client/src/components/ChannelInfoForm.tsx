import React from "react";

interface FormData {
    username: string;
    title: string;
    description: string;
    avatarUrl: string;
    thumbnailUrl: string;
}

interface ChannelInfoFormProps {
    formData: FormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    isUpdating: boolean;
    updateError: string | null;
}

export const ChannelInfoForm: React.FC<ChannelInfoFormProps> = React.memo(
    ({ formData, handleInputChange, handleSubmit, isUpdating, updateError }) => (
        <form
            onSubmit={handleSubmit}
            className="bg-[#0D1B1E] rounded-lg p-6 mb-8 shadow-lg backdrop-blur-sm bg-opacity-50"
        >
            <h2 className="text-2xl font-semibold mb-6 text-primary">Channel Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(["title", "description", "avatarUrl", "username", "thumbnailUrl"] as const).map((field) => (
                    <div key={field}>
                        <label className="block text-secondary text-sm font-bold mb-2" htmlFor={field}>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-dark border-primary text-secondary"
                            id={field}
                            name={field}
                            type="text"
                            value={formData[field]}
                            onChange={handleInputChange}
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
                    {isUpdating ? "Updating..." : "Update Channel Info"}
                </button>
            </div>
            {updateError && <p className="text-red-500 mt-4">{updateError}</p>}
        </form>
    )
);
