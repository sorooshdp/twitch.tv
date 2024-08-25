import React, { ChangeEvent, FocusEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import Input from "./Input";
import { AuthData as FormInfo } from "../ts/types/Auth";
import { isEmail, isPassword } from "../ts/utils/Validation";
import { useAuth } from "../ts/hooks/useAuth";

const Signup: React.FC = () => {
    const { signup, isLoading } = useAuth();
    const [formData, setFormData] = useState<FormInfo>({
        username: "",
        email: "",
        password: "",
    });
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<Partial<FormInfo & { confirmPassword: string }>>({});
    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case "username":
                return value.length >= 3 ? undefined : "Username must be at least 3 characters long";
            case "email":
                return isEmail(value) ? undefined : "Invalid email address";
            case "password":
                return isPassword(value)
                    ? undefined
                    : "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character";
            case "confirmPassword":
                return value === formData.password ? undefined : "Passwords do not match";
            default:
                return undefined;
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "confirmPassword") {
            setConfirmPassword(value);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
        const isValid =
            Object.values(errors).every(error => error === undefined) &&
            formData.username !== "" &&
            formData.email !== "" &&
            formData.password !== "" &&
            confirmPassword !== "";
        setIsFormValid(isValid);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isFormValid) {
            console.log("Form is valid. Submitting...", formData);
            await signup(formData.username, formData.email, formData.password);
        } else {
            console.log("Form is invalid");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-dark text-secondary">
            <div className="bg-opacity-20 bg-secondary backdrop-filter backdrop-blur-sm rounded-lg p-8 shadow-lg">
                <h1 className="text-4xl font-bold text-primary mb-8 text-center">Sign Up</h1>
                <form className="space-y-4 w-80" onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Username"
                        label="Username"
                        required
                        error={errors.username}
                    />
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Email"
                        label="Email"
                        required
                        error={errors.email}
                    />
                    <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Password"
                        label="Password"
                        required
                        error={errors.password}
                    />
                    <Input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={
                            (e) => {
                                handleChange(e);
                                handleBlur(e);
                            }
                        }
                        placeholder="Confirm Password"
                        label="Confirm Password"
                        required
                        error={errors.confirmPassword}
                    />
                    <button
                        type="submit"
                        className={`bg-primary text-secondary py-2 px-4 rounded w-full transition duration-300 flex items-center justify-center ${
                            isFormValid && !isLoading ? "hover:bg-opacity-90" : "opacity-50 cursor-not-allowed"
                        }`}
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing up...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>
                <p className="mt-4 text-muted text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:text-opacity-90 transition duration-300">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;