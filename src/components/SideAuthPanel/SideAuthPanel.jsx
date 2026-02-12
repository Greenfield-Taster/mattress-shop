import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './SideAuthPanel.scss';

const SideAuthPanel = ({ isOpen = false, onClose }) => {
  const [authStep, setAuthStep] = useState('phone'); // 'phone' | 'code'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { sendCode, login, loginWithGoogle } = useAuth();

  const handlePhoneChange = (e) => {
    setError('');
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 9) {
      setPhoneNumber(value);
    }
  };

  const handleCodeChange = (index, value) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return;

    setError('');

    // Якщо вставлено кілька цифр — розкидати по полях
    if (digits.length > 1) {
      const newCode = [...code];
      for (let i = 0; i < digits.length && index + i < 6; i++) {
        newCode[index + i] = digits[i];
      }
      setCode(newCode);
      const lastIdx = Math.min(index + digits.length, 5);
      const target = document.getElementById(`code-${lastIdx}`);
      if (target) target.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = digits;
    setCode(newCode);

    // Автофокус на наступне поле
    if (digits && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    setError('');
    const newCode = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);

    const lastIdx = Math.min(pasted.length, 5);
    const target = document.getElementById(`code-${lastIdx}`);
    if (target) target.focus();
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const fullCode = code.join('');
      if (fullCode.length === 6 && !isSubmitting) {
        handleSubmitCode();
      }
    }
  };

  const handleResendCode = async () => {
    setError('');
    setIsSubmitting(true);

    // Формат 0XXXXXXXXX (10 цифр)
    const result = await sendCode('0' + phoneNumber);

    setIsSubmitting(false);

    if (result.success) {
      // Можна показати повідомлення про успішну відправку
      console.log('Code sent successfully');
    } else {
      setError(result.error || 'Помилка відправки коду');
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    
    // Ініціалізація Google OAuth
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback
      });
      window.google.accounts.id.prompt();
    } else {
      setError('Google OAuth не завантажено');
    }
  };

  const handleGoogleCallback = async (response) => {
    setIsSubmitting(true);
    
    const result = await loginWithGoogle(response.credential);
    
    setIsSubmitting(false);

    if (result.success) {
      onClose();
      // Скинути форму
      resetForm();
    } else {
      setError(result.error || 'Помилка авторизації через Google');
    }
  };

  const handleSubmitPhone = async () => {
    if (phoneNumber.length !== 9) return;

    setError('');
    setIsSubmitting(true);

    // Формат 0XXXXXXXXX (10 цифр)
    const result = await sendCode('0' + phoneNumber);

    setIsSubmitting(false);

    if (result.success) {
      setAuthStep('code');
    } else {
      setError(result.error || 'Помилка відправки коду');
    }
  };

  const handleSubmitCode = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    setError('');
    setIsSubmitting(true);

    // Формат 0XXXXXXXXX (10 цифр)
    const result = await login('0' + phoneNumber, fullCode);

    setIsSubmitting(false);

    if (result.success) {
      onClose();
      // Скинути форму
      resetForm();
    } else {
      setError(result.error || 'Невірний код');
    }
  };

  const handleBackToPhone = () => {
    setAuthStep('phone');
    setCode(['', '', '', '', '', '']);
    setError('');
  };

  const resetForm = () => {
    setAuthStep('phone');
    setPhoneNumber('');
    setCode(['', '', '', '', '', '']);
    setError('');
    setIsSubmitting(false);
  };

  // Скинути форму при закритті
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`auth-backdrop ${isOpen ? 'active' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Side Panel */}
      <aside className={`side-auth-panel ${isOpen ? 'open' : ''}`}>
        {/* Close Button */}
        <button 
          className="close-btn" 
          onClick={handleClose} 
          aria-label="Закрити"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M18 6L6 18M6 6L18 18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Logo / Header */}
        <div className="auth-header">
          <div className="logo-icon">🛏️</div>
          <h2 className="auth-title">Вітаємо в Mattress Shop</h2>
          <p className="auth-subtitle">
            {authStep === 'phone' 
              ? 'Увійдіть або створіть акаунт' 
              : 'Введіть код з SMS'}
          </p>
        </div>

        {/* Auth Content */}
        <div className="auth-content">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path 
                  d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" 
                  stroke="currentColor" 
                  strokeWidth="2"
                />
                <path 
                  d="M10 6V10M10 14H10.01" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {authStep === 'phone' ? (
            <>
              {/* Phone Input */}
              <div className="input-group">
                <label htmlFor="phone" className="input-label">
                  Номер телефону
                </label>
                <div className="phone-input-wrapper">
                  <span className="phone-prefix">+380</span>
                  <input
                    type="tel"
                    id="phone"
                    className="input-field phone-input"
                    placeholder="XX XXX XX XX"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && phoneNumber.length === 9 && !isSubmitting) {
                        handleSubmitPhone();
                      }
                    }}
                    maxLength={9}
                    autoComplete="tel"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                className="btn btn-primary"
                onClick={handleSubmitPhone}
                disabled={phoneNumber.length !== 9 || isSubmitting}
                type="button"
              >
                <span>{isSubmitting ? 'Відправка...' : 'Отримати код'}</span>
                {!isSubmitting && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path 
                      d="M7.5 15L12.5 10L7.5 5" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              {/* Divider */}
              <div className="divider">
                <span>або</span>
              </div>

              {/* Google Auth Button */}
              <button 
                className="btn btn-google"
                onClick={handleGoogleAuth}
                type="button"
                disabled={isSubmitting}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path 
                    d="M18.1711 8.36788H9.99976V11.8477H14.7075C14.3104 13.7673 12.5459 15.0186 9.99976 15.0186C7.09648 15.0186 4.74484 12.667 4.74484 9.76367C4.74484 6.86039 7.09648 4.50879 9.99976 4.50879C11.3142 4.50879 12.5061 5.00254 13.4052 5.8177L16.0034 3.21948C14.4681 1.82967 12.3547 1.02881 9.99976 1.02881C5.1757 1.02881 1.26489 4.93962 1.26489 9.76367C1.26489 14.5877 5.1757 18.4985 9.99976 18.4985C14.5399 18.4985 18.2504 15.1477 18.2504 9.76367C18.2504 9.29195 18.2201 8.82256 18.1711 8.36788Z" 
                    fill="#4285F4"
                  />
                </svg>
                <span>Продовжити з Google</span>
              </button>
            </>
          ) : (
            <>
              {/* Back Button */}
              <button 
                className="back-btn"
                onClick={handleBackToPhone}
                type="button"
                disabled={isSubmitting}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path 
                    d="M12.5 15L7.5 10L12.5 5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Назад</span>
              </button>

              {/* Phone Number Display */}
              <div className="phone-display">
                <span className="phone-display-label">Код надіслано на:</span>
                <span className="phone-display-number">+380 {phoneNumber}</span>
              </div>

              {/* Code Inputs */}
              <div className="code-input-group">
                <label className="input-label">
                  Код підтвердження
                </label>
                <div className="code-inputs">
                  {code.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`code-${idx}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="code-input"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(idx, e.target.value)}
                      onPaste={handleCodePaste}
                      onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                      autoComplete="one-time-code"
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
              </div>

              {/* Resend Code */}
              <div className="resend-wrapper">
                <span className="resend-text">Не отримали код?</span>
                <button 
                  className="resend-btn"
                  onClick={handleResendCode}
                  type="button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Відправка...' : 'Надіслати повторно'}
                </button>
              </div>

              {/* Submit Button */}
              <button 
                className="btn btn-primary"
                onClick={handleSubmitCode}
                disabled={code.join('').length !== 6 || isSubmitting}
                type="button"
              >
                <span>{isSubmitting ? 'Перевірка...' : 'Підтвердити'}</span>
                {!isSubmitting && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path 
                      d="M16.6668 5L7.50016 14.1667L3.3335 10" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p className="footer-text">
            Продовжуючи, ви приймаєте наші{' '}
            <a href="/terms" className="footer-link">
              Умови використання
            </a>
            {' '}та{' '}
            <a href="/privacy" className="footer-link">
              Політику конфіденційності
            </a>
          </p>
        </div>
      </aside>
    </>
  );
};

export default SideAuthPanel;
