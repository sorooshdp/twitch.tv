import React from "react";
import { ChannelProps as FormData } from "../ts/types/Channel";

interface ChannelInfoFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; 
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isUpdating: boolean;
  updateError: string | null;
}

export const ChannelInfoForm: React.FC<ChannelInfoFormProps> = React.memo(
  ({ formData, handleInputChange, handleSubmit, isUpdating, updateError }) => (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0D1B1E] rounded-lg p-4 sm:p-6 mb-8 shadow-lg backdrop-blur-sm bg-opacity-50"
    >
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-primary">Channel Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {(["title", "description", "avatarUrl", "username", "thumbnailUrl"] as const).map((field) => (
          <div key={field} className={field === "description" ? "sm:col-span-2" : ""}>
            <label className="block text-secondary text-sm font-bold mb-2" htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            {field === "description" ? (
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-dark border-primary text-secondary resize-none"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}  
                rows={3}
              />
            ) : (
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-dark border-primary text-secondary"
                id={field}
                name={field}
                type="text"
                value={formData[field]}
                onChange={handleInputChange}  
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="w-full sm:w-auto bg-primary text-dark font-bold py-2 px-4 rounded hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Channel Info"}
        </button>
      </div>
      {updateError && <p className="text-red-500 mt-4 text-sm">{updateError}</p>}
    </form>
  )
);

