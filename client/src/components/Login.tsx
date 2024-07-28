import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "./Input";
import { FormInfo, isEmail } from "../ts/utils/Validation";
import { useAuth } from "../ts/hooks/useAuth";

const Login: React.FC = () => {
    const { login, isLoading } = useAuth();
    const [formData, setFormData] = useState<FormInfo>({
        username:"",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<Partial<FormInfo>>({});
    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case "email":
                return isEmail(value) ? undefined : "Invalid email address";
            case "password":
                return value.length >= 8 ? undefined : "Password must be at least 8 characters long";
            default:
                return undefined;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
        const isValid =
            error === undefined &&
            formData.email !== "" &&
            formData.password !== "";
        setIsFormValid(isValid);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isFormValid) {
            console.log("Form is valid. Submitting...", formData);
            await login(formData.email, formData.password);
        } else {
            console.log("Form is invalid");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-dark text-secondary">
            <div className="bg-opacity-20 bg-secondary backdrop-filter backdrop-blur-sm rounded-lg p-8 shadow-lg">
                <h1 className="text-4xl font-bold text-primary mb-8 text-center">Login</h1>
                <form className="space-y-4 w-80" onSubmit={handleSubmit}>
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
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
                <p className="mt-4 text-muted text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:text-opacity-90 transition duration-300">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;