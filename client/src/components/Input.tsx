import React, { InputHTMLAttributes, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value !== '');
  };

  return (
    <div className="w-full relative">
      <input
        className={`peer border py-2 px-4 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
          error ? 'border-red-500' : 'border-muted'
        } ${className} placeholder-transparent`}
        placeholder={label}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {label && (
        <label 
          className={`absolute left-4 -top-2.5 bg-white px-1 text-sm transition-all duration-200 
          ${isFocused || hasValue 
            ? 'text-primary  text-xs' 
            : 'text-gray-500 top-2.5 text-base'
          }
          peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base
          peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-secondary peer-focus:rounded`}
        >
          {label}
        </label>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;