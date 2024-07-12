export type FormInfo = {
    email: string;
    password: string;
};

export const isEmail = (value: string): boolean => /\S+@\S+\.\S+/.test(value) || value === "";

export const isAlphanumeric = (value: string): boolean => /^[a-zA-Z0-9]+$/.test(value);

/**
 * Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
 * @param value string
 * @returns boolean
 */
export const isPassword = (value: string): boolean =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/.test(value) || value === "";
