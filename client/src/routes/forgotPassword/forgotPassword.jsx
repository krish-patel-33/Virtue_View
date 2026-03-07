import { Link } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function ForgotPassword() {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        const formData = new FormData(e.target);
        const email = formData.get("email");

        try {
            const res = await apiRequest.post("/auth/forgot-password", {
                email,
            });
            setMessage(res.data.message);
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 focus:border-[#fece51] focus:bg-white transition-colors";

    return (
        <div className="flex h-full">
            <div className="flex-[3] flex items-center justify-center p-10 bg-white">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-[400px]">
                    <h1 className="text-3xl font-bold text-[#040404] font-playfair">Forgot Password</h1>
                    <p className="text-sm text-gray-500">Enter your email address and we&apos;ll send you a link to reset your password.</p>
                    <input name="email" type="email" placeholder="Email" required className={inputCls} />
                    <button
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-[#fece51] to-[#f0b400] text-white font-semibold rounded-lg cursor-pointer border-none hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                    {error && <span className="text-sm text-red-500 text-center">{error}</span>}
                    {message && <span className="text-sm text-green-600 text-center">{message}</span>}
                    <div className="text-center text-sm text-gray-500">
                        <Link to="/login" className="text-[#fece51] font-medium hover:underline">Back to Login</Link>
                    </div>
                </form>
            </div>
            <div className="flex-[2] hidden md:block overflow-hidden">
                <img src="/bg.png" alt="" className="w-full h-full object-cover" />
            </div>
        </div>
    );
}

export default ForgotPassword;
