import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, updateUser, loading } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser && !loading) {
      navigate("/");
    }
  }, [currentUser, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const { username, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });

      if (res.data) {
        updateUser(res.data);
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 focus:border-[#fece51] focus:bg-white transition-colors";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-[3] flex items-center justify-center p-10 bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-[400px]">
          <h1 className="text-3xl font-bold text-[#040404] font-playfair">Welcome back</h1>
          <input name="username" required minLength={3} maxLength={20} type="text" placeholder="Username" className={inputCls} />
          <input name="password" type="password" required placeholder="Password" className={inputCls} />
          <button
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#fece51] to-[#f0b400] text-white font-semibold rounded-lg cursor-pointer border-none hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center">
            <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-[#fece51] transition-colors">Forgot Password?</Link>
          </div>
          {error && <span className="text-sm text-red-500 text-center">{error}</span>}
          <div className="text-center text-sm text-gray-500">
            <Link to="/register" className="text-[#fece51] font-medium hover:underline">{"Don't"} you have an account?</Link>
          </div>
        </form>
      </div>
      <div className="flex-[2] hidden md:block overflow-hidden">
        <img src="/bg.png" alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default Login;
