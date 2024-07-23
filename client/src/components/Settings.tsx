import React, { useState, ChangeEvent } from 'react';

interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const Input: React.FC<InputProps> = ({ label, name, value, onChange, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-secondary text-sm font-bold mb-2" htmlFor={name}>
      {label}
    </label>
    <input
      className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-dark border-primary text-secondary"
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
    />
  </div>
);

interface ChannelInfo {
  title: string;
  description: string;
  avatarUrl: string;
  username: string;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}

const SettingsPage: React.FC = () => {
  const [channelInfo, setChannelInfo] = useState<ChannelInfo>({
    title: '',
    description: '',
    avatarUrl: '',
    username: ''
  });

  const [passwordChange, setPasswordChange] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: ''
  });

  const [streamKey, setStreamKey] = useState<string>('••••••••••••••••');
  const [showStreamKey, setShowStreamKey] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChannelInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordChange(prev => ({ ...prev, [name]: value }));
  };

  const toggleStreamKey = () => {
    setShowStreamKey(!showStreamKey);
  };

  const handlePasswordSubmit = () => {
    // Here you would typically send a request to your backend to change the password
    console.log('Password change submitted:', passwordChange);
    // Reset password fields after submission
    setPasswordChange({ currentPassword: '', newPassword: '' });
  };

  return (
    <div className="min-h-screen bg-dark text-secondary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Channel Settings</h1>
        
        <div className="bg-[#0D1B1E] rounded-lg p-6 mb-8 shadow-lg backdrop-blur-sm bg-opacity-50">
          <h2 className="text-2xl font-semibold mb-6 text-primary">Channel Information</h2>
          <Input
            label="Channel Title"
            name="title"
            value={channelInfo.title}
            onChange={handleInputChange}
          />
          <Input
            label="Description"
            name="description"
            value={channelInfo.description}
            onChange={handleInputChange}
          />
          <Input
            label="Avatar URL"
            name="avatarUrl"
            value={channelInfo.avatarUrl}
            onChange={handleInputChange}
          />
          <Input
            label="Username"
            name="username"
            value={channelInfo.username}
            onChange={handleInputChange}
          />
          <button className="mt-8 bg-primary text-dark py-2 px-6 rounded-full hover:bg-opacity-80 transition duration-300 flex items-center">
            <span className="mr-2">💾</span>
            Save Changes
          </button>
        </div>
        
        <div className="bg-[#0D1B1E] rounded-lg p-6 mb-8 shadow-lg backdrop-blur-sm bg-opacity-50">
          <h2 className="text-2xl font-semibold mb-6 text-primary">Change Password</h2>
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordChange.currentPassword}
            onChange={handlePasswordChange}
          />
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordChange.newPassword}
            onChange={handlePasswordChange}
          />
          <button 
            onClick={handlePasswordSubmit}
            className="mt-4 bg-primary text-dark py-2 px-6 rounded-full hover:bg-opacity-80 transition duration-300 flex items-center"
          >
            <span className="mr-2">🔒</span>
            Change Password
          </button>
        </div>
        
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
                className="bg-dark border border-primary rounded px-3 py-1 text-secondary"
              />
              <button 
                onClick={toggleStreamKey}
                className="text-primary hover:text-opacity-80 transition duration-300"
              >
                {showStreamKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button className="mt-6 text-primary hover:text-opacity-80 transition duration-300 flex items-center">
            <span className="mr-2">Advanced stream settings</span>
            <span>▶</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;