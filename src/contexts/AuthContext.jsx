import React, { createContext, useState, useEffect } from 'react';

/**
 * AuthContext - контекст для управління авторизацією
 */

export const AuthContext = createContext(null);

// Налаштування
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const MOCK_MODE = import.meta.env.VITE_MOCK_AUTH === 'true';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Перевірка токена при завантаженні
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      if (MOCK_MODE) {
        // Mock режим
        const mockUser = JSON.parse(localStorage.getItem('mockUser') || 'null');
        if (mockUser) {
          setUser(mockUser);
        }
      } else {
        // Реальний API
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('authToken');
        }
      }
    }
    
    setIsLoading(false);
  };

  /**
   * Відправка SMS коду
   */
  const sendCode = async (phone) => {
    if (MOCK_MODE) {
      console.log('🔄 MOCK: Відправка коду на', phone);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        success: true, 
        expiresIn: 300 
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone })
      });

      if (!response.ok) {
        throw new Error('Не вдалося відправити код');
      }

      const data = await response.json();
      return { 
        success: true, 
        expiresIn: data.expiresIn 
      };
    } catch (error) {
      console.error('Send code error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  /**
   * Вхід через SMS код
   */
  const login = async (phone, code) => {
    if (MOCK_MODE) {
      console.log('🔄 MOCK: Перевірка коду', code, 'для', phone);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (code === '123456') {
        const mockUser = {
          id: '1',
          phone: phone,
          name: 'Тестовий користувач'
        };
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser);
        
        console.log('✅ MOCK: Успішний вхід!');
        return { success: true };
      }
      
      console.log('❌ MOCK: Невірний код');
      return { 
        success: false, 
        error: 'Невірний код. Спробуйте 123456' 
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, code })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Невірний код');
      }

      const data = await response.json();
      
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  /**
   * Вхід через Google
   */
  const loginWithGoogle = async (credential) => {
    if (MOCK_MODE) {
      console.log('🔄 MOCK: Google авторизація');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: '2',
        email: 'test@gmail.com',
        name: 'Google користувач',
        avatar: 'https://via.placeholder.com/150'
      };
      const mockToken = 'mock_google_token_' + Date.now();
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
      
      console.log('✅ MOCK: Успішний вхід через Google!');
      return { success: true };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential })
      });

      if (!response.ok) {
        throw new Error('Google authentication failed');
      }

      const data = await response.json();
      
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  /**
   * Вихід з акаунту
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('mockUser');
    setUser(null);
    console.log('👋 Вихід виконано');
  };

  /**
   * Оновлення даних користувача
   */
  const updateUser = async (userData) => {
    if (MOCK_MODE) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      return { success: true };
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/auth/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      setUser(data.user);
      
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    sendCode,
    login,
    loginWithGoogle,
    logout,
    updateUser,
  };

  if (MOCK_MODE) {
    console.log('🧪 Auth працює в MOCK режимі. Код для входу: 123456');
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
