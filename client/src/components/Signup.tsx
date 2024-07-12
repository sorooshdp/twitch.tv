import React, {useState } from "react";
import { Link } from "react-router-dom";
import Input from "./Input";
import { FormInfo, isEmail, isPassword } from "../ts/utils/Validation";

const SignupPage: React.FC = () => {
    const [formData, setFormData] = useState<FormInfo>({
        email: "",
        password: "",
    });
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<Partial<FormInfo & { confirmPassword: string }>>({});
    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "confirmPassword") {
            setConfirmPassword(value);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
        const isValid =
            error == undefined &&
            formData.email !== "" &&
            formData.password !== "" &&
            confirmPassword !== "";
        setIsFormValid(isValid);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isFormValid) {
            console.log("Form is valid. Submitting...", formData);
            // Here you would typically send the data to your backend
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
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Confirm Password"
                        label="Confirm Password"
                        required
                        error={errors.confirmPassword}
                    />
                    <button
                        type="submit"
                        className={`bg-primary text-secondary py-2 px-4 rounded w-full transition duration-300 ${
                            isFormValid ? "hover:bg-opacity-90" : "opacity-50 cursor-not-allowed"
                        }`}
                        disabled={!isFormValid}
                    >
                        Sign Up
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

export default SignupPage;
