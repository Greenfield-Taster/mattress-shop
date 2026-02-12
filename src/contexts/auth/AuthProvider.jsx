import { useState, useEffect, useCallback, useMemo } from "react";
import { AuthContext } from "./AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("authToken");
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const sendCode = useCallback(async (phone) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не вдалося відправити код");
      }

      return {
        success: true,
        expiresIn: data.expiresIn,
      };
    } catch (error) {
      console.error("Send code error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }, []);

  const login = useCallback(async (phone, code) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Невірний код");
      }

      localStorage.setItem("authToken", data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Google authentication failed");
      }

      localStorage.setItem("authToken", data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      console.error("Google login error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
  }, []);

  const updateUser = useCallback(async (userData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      setUser(data.user);

      return { success: true };
    } catch (error) {
      console.error("Update user error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      sendCode,
      login,
      loginWithGoogle,
      logout,
      updateUser,
    }),
    [user, isLoading, sendCode, login, loginWithGoogle, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
