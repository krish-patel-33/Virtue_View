import "./resetPassword.scss";
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

    if (!token) {
        return (
            <div className="resetPassword">
                <div className="formContainer">
                    <p className="error">Invalid Request. No token provided.</p>
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="resetPassword">
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <h1>Reset Password</h1>
                    <input name="password" type="password" placeholder="New Password" required minLength={6} />
                    <input name="confirmPassword" type="password" placeholder="Confirm New Password" required minLength={6} />
                    <button disabled={isLoading}>
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                    {error && <span className="error">{error}</span>}
                    {message && <span className="success" style={{ color: "green" }}>{message}</span>}
                </form>
            </div>
            <div className="imgContainer">
                <img src="/bg.png" alt="" />
            </div>
        </div>
    );
}

export default ResetPassword;
