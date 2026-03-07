import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function ResetPassword() {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        const formData = new FormData(e.target);
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await apiRequest.post("/auth/reset-password", {
                token,
                newPassword: password,
            });
            setMessage("Password reset successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 focus:border-[#fece51] focus:bg-white transition-colors";

    if (!token) {
        return (
            <div className="flex items-center justify-center h-full gap-4 flex-col">
                <p className="text-red-500">Invalid Request. No token provided.</p>
                <Link to="/login" className="text-[#fece51] hover:underline">Back to Login</Link>
            </div>
        );
    }

    return (
        <div className="flex h-full">
            <div className="flex-[3] flex items-center justify-center p-10 bg-white">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-[400px]">
                    <h1 className="text-3xl font-bold text-[#040404] font-playfair">Reset Password</h1>
                    <input name="password" type="password" placeholder="New Password" required minLength={6} className={inputCls} />
                    <input name="confirmPassword" type="password" placeholder="Confirm New Password" required minLength={6} className={inputCls} />
                    <button
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-[#fece51] to-[#f0b400] text-white font-semibold rounded-lg cursor-pointer border-none hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                    {error && <span className="text-sm text-red-500 text-center">{error}</span>}
                    {message && <span className="text-sm text-green-600 text-center">{message}</span>}
                </form>
            </div>
            <div className="flex-[2] hidden md:block overflow-hidden">
                <img src="/bg.png" alt="" className="w-full h-full object-cover" />
            </div>
        </div>
    );
}

export default ResetPassword;
