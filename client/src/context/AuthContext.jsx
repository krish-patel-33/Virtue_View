import { createContext, useEffect, useState } from "react";
import apiRequest from "../lib/apiRequest";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await apiRequest.get("/auth/verify");
        setCurrentUser(res.data);
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  const updateUser = (data) => {
    setCurrentUser(data);
    // Don't store in localStorage anymore
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
