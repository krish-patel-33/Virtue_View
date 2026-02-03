import "./forgotPassword.scss";
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

    return (
        <div className="forgotPassword">
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <h1>Forgot Password</h1>
                    <p style={{ marginBottom: "20px" }}>Enter your email address and we'll send you a link to reset your password.</p>
                    <input name="email" type="email" placeholder="Email" required />
                    <button disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                    {error && <span className="error">{error}</span>}
                    {message && <span className="success" style={{ color: "green" }}>{message}</span>}
                    <div className="links">
                        <Link to="/login">Back to Login</Link>
                    </div>
                </form>
            </div>
            <div className="imgContainer">
                <img src="/bg.png" alt="" />
            </div>
        </div>
    );
}

export default ForgotPassword;
