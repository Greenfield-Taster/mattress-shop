import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MattressQuiz.scss";

const MattressQuiz = ({ onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    size: null,
    hardness: null,
    load: null,
    warranty: null,
  });
  const [timeLeft, setTimeLeft] = useState(60);
  const [isComplete, setIsComplete] = useState(false);

  // Таймер
  useEffect(() => {
    if (timeLeft > 0 && !isComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isComplete]);

  const steps = [
    {
      id: "size",
      title: "Оберіть розмір матраца",
      options: [
        { value: "80x190", label: "80×190 см", subtitle: "Односпальний" },
        { value: "90x200", label: "90×200 см", subtitle: "Односпальний" },
        { value: "120x200", label: "120×200 см", subtitle: "Полуторний" },
        { value: "140x200", label: "140×200 см", subtitle: "Двоспальний" },
        { value: "160x200", label: "160×200 см", subtitle: "Двоспальний" },
        { value: "180x200", label: "180×200 см", subtitle: "King Size" },
      ],
    },
    {
      id: "hardness",
      title: "Яка жорсткість вам потрібна?",
      options: [
        {
          value: "soft",
          label: "М'який",
          subtitle: "Для сну на боці",
          icon: "🌙",
        },
        {
          value: "medium",
          label: "Середній",
          subtitle: "Універсальний",
          icon: "⭐",
        },
        {
          value: "hard",
          label: "Жорсткий",
          subtitle: "Для сну на спині",
          icon: "💪",
        },
      ],
    },
    {
      id: "load",
      title: "Навантаження на спальне місце",
      options: [
        {
          value: "light",
          label: "До 60 кг",
          subtitle: "Легке навантаження",
        },
        {
          value: "medium",
          label: "60-90 кг",
          subtitle: "Середнє навантаження",
        },
        {
          value: "heavy",
          label: "90-120 кг",
          subtitle: "Високе навантаження",
        },
        {
          value: "extra",
          label: "Понад 120 кг",
          subtitle: "Максимальне навантаження",
        },
      ],
    },
    {
      id: "warranty",
      title: "Яка гарантія вам важлива?",
      options: [
        {
          value: "1year",
          label: "1 рік",
          subtitle: "Базова гарантія",
        },
        {
          value: "3years",
          label: "3 роки",
          subtitle: "Стандартна гарантія",
        },
        {
          value: "5years",
          label: "5 років",
          subtitle: "Розширена гарантія",
        },
        {
          value: "10years",
          label: "10 років",
          subtitle: "Максимальна гарантія",
        },
      ],
    },
  ];

  const handleSelectOption = (stepId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [stepId]: value,
    }));

    // Переходимо до наступного кроку
    if (currentStep < steps.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    } else {
      // Завершуємо квіз
      setTimeout(() => {
        setIsComplete(true);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleViewResults = () => {
    // Формуємо параметри для каталогу на основі відповідей
    const params = new URLSearchParams();
    
    if (answers.size) {
      params.append("size", answers.size);
    }
    if (answers.hardness) {
      params.append("hardness", answers.hardness);
    }
    if (answers.load) {
      params.append("load", answers.load);
    }
    if (answers.warranty) {
      params.append("warranty", answers.warranty);
    }

    navigate(`/catalog?${params.toString()}`);
    if (onClose) onClose();
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({
      size: null,
      hardness: null,
      load: null,
      warranty: null,
    });
    setTimeLeft(60);
    setIsComplete(false);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isComplete) {
    return (
      <div className="mattress-quiz">
        <div className="mattress-quiz__container">
          <button className="mattress-quiz__close" onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="mattress-quiz__complete">
            <div className="mattress-quiz__complete-icon">✓</div>
            <h2 className="mattress-quiz__complete-title">
              Підбір завершено!
            </h2>
            <p className="mattress-quiz__complete-text">
              Ми підібрали для вас найкращі варіанти матраців за вашими
              параметрами
            </p>

            <div className="mattress-quiz__complete-summary">
              <h3>Ваш вибір:</h3>
              <ul>
                <li>
                  <span>Розмір:</span>{" "}
                  <strong>
                    {steps[0].options.find((o) => o.value === answers.size)
                      ?.label || "Не вибрано"}
                  </strong>
                </li>
                <li>
                  <span>Жорсткість:</span>{" "}
                  <strong>
                    {steps[1].options.find((o) => o.value === answers.hardness)
                      ?.label || "Не вибрано"}
                  </strong>
                </li>
                <li>
                  <span>Навантаження:</span>{" "}
                  <strong>
                    {steps[2].options.find((o) => o.value === answers.load)
                      ?.label || "Не вибрано"}
                  </strong>
                </li>
                <li>
                  <span>Гарантія:</span>{" "}
                  <strong>
                    {steps[3].options.find((o) => o.value === answers.warranty)
                      ?.label || "Не вибрано"}
                  </strong>
                </li>
              </ul>
            </div>

            <div className="mattress-quiz__complete-actions">
              <button
                className="mattress-quiz__button mattress-quiz__button--primary"
                onClick={handleViewResults}
              >
                Переглянути результати
              </button>
              <button
                className="mattress-quiz__button mattress-quiz__button--secondary"
                onClick={handleRestart}
              >
                Пройти знову
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="mattress-quiz">
      <div className="mattress-quiz__container">
        <button className="mattress-quiz__close" onClick={onClose}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="mattress-quiz__header">
          <div className="mattress-quiz__timer">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="10" cy="10" r="9" />
              <path d="M10 5v5l3 3" />
            </svg>
            <span>{timeLeft}с</span>
          </div>

          <div className="mattress-quiz__steps">
            Крок {currentStep + 1} з {steps.length}
          </div>
        </div>

        <div className="mattress-quiz__progress">
          <div
            className="mattress-quiz__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mattress-quiz__content">
          <h2 className="mattress-quiz__title">{currentStepData.title}</h2>

          <div className="mattress-quiz__options">
            {currentStepData.options.map((option) => (
              <button
                key={option.value}
                className={`mattress-quiz__option ${
                  answers[currentStepData.id] === option.value
                    ? "mattress-quiz__option--selected"
                    : ""
                }`}
                onClick={() =>
                  handleSelectOption(currentStepData.id, option.value)
                }
              >
                {option.icon && (
                  <span className="mattress-quiz__option-icon">
                    {option.icon}
                  </span>
                )}
                <div className="mattress-quiz__option-content">
                  <span className="mattress-quiz__option-label">
                    {option.label}
                  </span>
                  <span className="mattress-quiz__option-subtitle">
                    {option.subtitle}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {currentStep > 0 && (
          <div className="mattress-quiz__footer">
            <button
              className="mattress-quiz__button mattress-quiz__button--back"
              onClick={handleBack}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5l-7 7 7 7" />
              </svg>
              Назад
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MattressQuiz;
