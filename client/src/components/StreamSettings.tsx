import React from 'react';

interface StreamSettingsProps {
  streamKey: string;
  showStreamKey: boolean;
  toggleStreamKeyVisibility: () => void;
}

export const StreamSettings: React.FC<StreamSettingsProps> = React.memo(({
  streamKey,
  showStreamKey,
  toggleStreamKeyVisibility
}) => (
  <div className="bg-[#0D1B1E] rounded-lg p-6 shadow-lg backdrop-blur-sm bg-opacity-50">
    <h2 className="text-2xl font-semibold mb-6 text-primary">Stream Settings</h2>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className="text-primary text-2xl">🔑</span>
        <div>
          <p className="font-medium">Stream Key</p>
          <p className="text-muted text-sm">Use this key to start streaming</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type={showStreamKey ? "text" : "password"}
          value={streamKey}
          readOnly
          className="bg-dark border border-primary rounded px-3 py-1 text-secondary w-64"
        />
        <button
          onClick={toggleStreamKeyVisibility}
          className="p-2 bg-primary text-dark rounded hover:bg-primary-dark transition-colors"
        >
          {showStreamKey ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  </div>
));