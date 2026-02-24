import { useEffect, useRef } from "react";
import useScrollLock from "../../hooks/useScrollLock";
import "./ConfirmModal.scss";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Так", cancelText = "Скасувати" }) => {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab' && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirm-modal">
      <div className="confirm-modal__overlay" onClick={onClose} />
      <div
        className="confirm-modal__container"
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="confirm-modal__content">
          <h3 className="confirm-modal__title">{title}</h3>
          <p className="confirm-modal__message">{message}</p>

          <div className="confirm-modal__actions">
            <button
              className="confirm-modal__button confirm-modal__button--cancel"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              className="confirm-modal__button confirm-modal__button--confirm"
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
