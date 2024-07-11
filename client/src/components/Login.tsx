import React from "react";
import { Link } from "react-router-dom";
import Input from "./Input"; // Make sure the path is correct

const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-secondary">
            <h1 className="text-4xl font-bold text-primary mb-8">Login</h1>
            <form className="space-y-4 w-64">
                <Input
                    type="email"
                    placeholder="Email"
                    label="Email"
                />
                <Input
                    type="password"
                    placeholder="Password"
                    label="Password"
                />
                <button type="submit" className="bg-primary text-secondary hover:bg-opacity-90 py-2 px-4 rounded w-full transition duration-300">
                    Login
                </button>
            </form>
            <p className="mt-4 text-dark">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:text-opacity-90 transition duration-300">
                    Sign Up
                </Link>
            </p>
        </div>
    );
};

export default LoginPage;