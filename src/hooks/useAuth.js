import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Кастомний хук для використання AuthContext
 * 
 * @returns {Object} auth - Об'єкт з методами та даними авторизації
 * @returns {Object|null} auth.user - Дані користувача
 * @returns {boolean} auth.isAuthenticated - Чи авторизований користувач
 * @returns {boolean} auth.isLoading - Стан завантаження
 * @returns {Function} auth.sendCode - Відправити SMS код
 * @returns {Function} auth.login - Вхід через SMS код
 * @returns {Function} auth.loginWithGoogle - Вхід через Google
 * @returns {Function} auth.logout - Вихід з акаунту
 * @returns {Function} auth.updateUser - Оновити дані користувача
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 * 
 * if (isAuthenticated) {
 *   return <div>Hello, {user.name}!</div>;
 * }
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;
