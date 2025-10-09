import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const LoginForm = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email обов\'язковий';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неправильний формат email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обов\'язковий';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль має бути не менше 6 символів';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Тут буде логіка входу
      console.log('Login:', formData);
      alert('Вхід успішний!');
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label className="form-label">Email</label>
        <div className="form-input-group">
          <Mail size={18} className="form-input-icon" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'form-input-error' : ''}`}
            placeholder="your@email.com"
          />
        </div>
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Пароль</label>
        <div className="form-input-group">
          <Lock size={18} className="form-input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`form-input ${errors.password ? 'form-input-error' : ''}`}
            placeholder="Введіть пароль"
          />
          <button
            type="button"
            className="form-input-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <span className="form-error">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label className="form-checkbox">
          <input type="checkbox" />
          <span className="form-checkbox-checkmark"></span>
          Запам'ятати мене
        </label>
      </div>

      <button type="submit" className="btn btn-primary btn-full">
        Увійти
      </button>

      <div className="auth-form-footer">
        <a href="#" className="auth-link">Забули пароль?</a>
        <div className="auth-switch">
          Немає акаунту? 
          <button 
            type="button" 
            className="auth-link" 
            onClick={onSwitchToRegister}
          >
            Зареєструватись
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;