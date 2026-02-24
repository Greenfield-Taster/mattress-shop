import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AuthContext } from "./AuthContext";
import { authenticatedFetch, proactiveRefresh } from "../../api/apiClient";
import { normalizeError } from "../../utils/errorMessages";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const response = await authenticatedFetch(`${API_BASE_URL}/auth/me`);

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

  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
    };
    window.addEventListener("auth:logout", handleForceLogout);
    return () => window.removeEventListener("auth:logout", handleForceLogout);
  }, []);

  const refreshIntervalRef = useRef(null);
  useEffect(() => {
    refreshIntervalRef.current = setInterval(() => {
      if (localStorage.getItem("authToken")) {
        proactiveRefresh();
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(refreshIntervalRef.current);
  }, []);

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
        error: normalizeError(error, "Не вдалося відправити код. Спробуйте пізніше."),
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
        error: normalizeError(error, "Помилка авторизації. Спробуйте ще раз."),
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
        throw new Error(data.error || "Помилка авторизації через Google");
      }

      localStorage.setItem("authToken", data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      console.error("Google login error:", error);
      return {
        success: false,
        error: normalizeError(error, "Помилка авторизації через Google. Спробуйте ще раз."),
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
  }, []);

  const updateUser = useCallback(async (userData) => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не вдалося оновити профіль");
      }

      setUser(data.user);

      return { success: true };
    } catch (error) {
      console.error("Update user error:", error);
      return {
        success: false,
        error: normalizeError(error, "Не вдалося оновити профіль. Спробуйте ще раз."),
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
