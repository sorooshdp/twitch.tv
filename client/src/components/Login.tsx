import React from "react";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-secondary">
            <h1 className="text-4xl font-bold text-primary mb-8">Login</h1>
            <form className="space-y-4">
                <input type="email" placeholder="Email" className="border py-2 px-4 rounded w-64" />
                <input type="password" placeholder="Password" className="border py-2 px-4 rounded w-64" />
                <button type="submit" className="bg-primary text-white py-2 px-4 rounded w-full">
                    Login
                </button>
            </form>
            <p className="mt-4">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary">
                    Sign Up
                </Link>
            </p>
        </div>
    );
};

export default LoginPage;
