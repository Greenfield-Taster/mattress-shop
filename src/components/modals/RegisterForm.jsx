import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

const RegisterForm = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ім\'я обов\'язкове';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Прізвище обов\'язкове';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email обов\'язковий';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неправильний формат email';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Телефон обов\'язковий';
    } else if (!/^\+380\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Неправильний формат телефону (+380XXXXXXXXX)';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обов\'язковий';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль має бути не менше 6 символів';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Підтвердження пароля обов\'язкове';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Паролі не співпадають';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Тут буде логіка реєстрації
      console.log('Register:', formData);
      alert('Реєстрація успішна!');
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Ім'я</label>
          <div className="form-input-group">
            <User size={18} className="form-input-icon" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`form-input ${errors.firstName ? 'form-input-error' : ''}`}
              placeholder="Ім'я"
            />
          </div>
          {errors.firstName && <span className="form-error">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Прізвище</label>
          <div className="form-input-group">
            <User size={18} className="form-input-icon" />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`form-input ${errors.lastName ? 'form-input-error' : ''}`}
              placeholder="Прізвище"
            />
          </div>
          {errors.lastName && <span className="form-error">{errors.lastName}</span>}
        </div>
      </div>

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
        <label className="form-label">Телефон</label>
        <div className="form-input-group">
          <Phone size={18} className="form-input-icon" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
            placeholder="+380 XX XXX XX XX"
          />
        </div>
        {errors.phone && <span className="form-error">{errors.phone}</span>}
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
        <label className="form-label">Підтвердіть пароль</label>
        <div className="form-input-group">
          <Lock size={18} className="form-input-icon" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`form-input ${errors.confirmPassword ? 'form-input-error' : ''}`}
            placeholder="Повторіть пароль"
          />
          <button
            type="button"
            className="form-input-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
      </div>

      <div className="form-group">
        <label className="form-checkbox">
          <input type="checkbox" required />
          <span className="form-checkbox-checkmark"></span>
          Я погоджуюсь з <a href="#" className="auth-link">умовами використання</a> та <a href="#" className="auth-link">політикою конфіденційності</a>
        </label>
      </div>

      <button type="submit" className="btn btn-primary btn-full">
        Зареєструватись
      </button>

      <div className="auth-form-footer">
        <div className="auth-switch">
          Вже маєте акаунт? 
          <button 
            type="button" 
            className="auth-link" 
            onClick={onSwitchToLogin}
          >
            Увійти
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;