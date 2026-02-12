import { useState, useEffect, useCallback, useMemo } from "react";
import { AuthContext } from "./AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const MOCK_MODE = import.meta.env.VITE_MOCK_AUTH === "true";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      if (MOCK_MODE) {
        const mockUser = JSON.parse(localStorage.getItem("mockUser") || "null");
        if (mockUser) {
          setUser(mockUser);
        }
      } else {
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
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const sendCode = useCallback(async (phone) => {
    if (MOCK_MODE) {
      console.log("🔄 MOCK: Відправка коду на", phone);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        success: true,
        expiresIn: 300,
      };
    }

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
    if (MOCK_MODE) {
      console.log("🔄 MOCK: Перевірка коду", code, "для", phone);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (code === "123456") {
        const mockUser = {
          id: "1",
          phone: phone,
          firstName: "Тестовий",
          lastName: "Користувач",
        };
        const mockToken = "mock_jwt_token_" + Date.now();

        localStorage.setItem("authToken", mockToken);
        localStorage.setItem("mockUser", JSON.stringify(mockUser));
        setUser(mockUser);

        console.log("✅ MOCK: Успішний вхід!");
        return { success: true };
      }

      console.log("❌ MOCK: Невірний код");
      return {
        success: false,
        error: "Невірний код. Спробуйте 123456",
      };
    }

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
    if (MOCK_MODE) {
      console.log("🔄 MOCK: Google авторизація");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser = {
        id: "2",
        email: "test@gmail.com",
        firstName: "Google",
        lastName: "Користувач",
      };
      const mockToken = "mock_google_token_" + Date.now();

      localStorage.setItem("authToken", mockToken);
      localStorage.setItem("mockUser", JSON.stringify(mockUser));
      setUser(mockUser);

      console.log("✅ MOCK: Успішний вхід через Google!");
      return { success: true };
    }

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
    localStorage.removeItem("mockUser");
    setUser(null);
    console.log("👋 Вихід виконано");
  }, []);

  const updateUser = useCallback(async (userData) => {
    if (MOCK_MODE) {
      setUser((prevUser) => {
        const updatedUser = { ...prevUser, ...userData };
        localStorage.setItem("mockUser", JSON.stringify(updatedUser));
        return updatedUser;
      });
      return { success: true };
    }

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

  if (MOCK_MODE && !isLoading) {
    console.log("🧪 Auth працює в MOCK режимі. Код для входу: 123456");
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
