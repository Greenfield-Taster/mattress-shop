import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  const [isComplete, setIsComplete] = useState(false);
  const [showAllSizes, setShowAllSizes] = useState(false);

  // Розміри з каталогу, розділені на категорії
  const allSizes = [
    "200х200",
    "180х200",
    "180х190",
    "170х200",
    "170х190",
    "160х200",
    "160х190",
    "150х200",
    "150х190",
    "140х200",
    "140х190",
    "120х200",
    "120х190",
    "90х200",
    "90х190",
    "80х200",
    "80х190",
    "70х200",
    "70х190",
    "80х180",
    "80х170",
    "80х160",
    "80х150",
    "70х180",
    "70х170",
    "70х160",
    "70х150",
    "60х120",
  ];

  // Популярні розміри (показуються спочатку)
  const popularSizes = [
    { value: "200х200", label: "200×200 см", subtitle: "King Size XL" },
    { value: "180х200", label: "180×200 см", subtitle: "King Size" },
    { value: "160х200", label: "160×200 см", subtitle: "Двоспальний" },
    { value: "140х200", label: "140×200 см", subtitle: "Двоспальний" },
    { value: "120х200", label: "120×200 см", subtitle: "Полуторний" },
    { value: "90х200", label: "90×200 см", subtitle: "Односпальний" },
    { value: "80х190", label: "80×190 см", subtitle: "Односпальний" },
    { value: "60х120", label: "60×120 см", subtitle: "Дитячий" },
  ];

  // Всі інші розміри
  const otherSizes = allSizes
    .filter((size) => !popularSizes.some((p) => p.value === size))
    .map((size) => {
      const [width, height] = size.split("х");
      let subtitle = "";
      const w = parseInt(width);

      if (w >= 180) subtitle = "King Size";
      else if (w >= 140) subtitle = "Двоспальний";
      else if (w === 120) subtitle = "Полуторний";
      else if (w >= 80 && w <= 90) subtitle = "Односпальний";
      else subtitle = "Дитячий";

      return {
        value: size,
        label: size.replace("х", "×") + " см",
        subtitle,
      };
    });

  const steps = [
    {
      id: "size",
      title: "Оберіть розмір матраца",
      isSize: true, // Спеціальний прапорець для розмірів
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
        setShowAllSizes(false); // Скидаємо стан показу всіх розмірів
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
      setShowAllSizes(false);
    }
  };

  const handleViewResults = () => {
    // Формуємо параметри для каталогу на основі відповідей
    const params = new URLSearchParams();

    if (answers.size) {
      params.append("sizes", answers.size);
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
    setIsComplete(false);
    setShowAllSizes(false);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isComplete) {
    return (
      <div className="mattress-quiz">
        <div className="mattress-quiz__overlay" />
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
            <h2 className="mattress-quiz__complete-title">Підбір завершено!</h2>
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
                    {popularSizes
                      .concat(otherSizes)
                      .find((o) => o.value === answers.size)?.label ||
                      "Не вибрано"}
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
      <div className="mattress-quiz__overlay" />
      <div className="mattress-quiz__container">
        <div className="mattress-quiz__header">
          <div className="mattress-quiz__steps">
            Крок {currentStep + 1} з {steps.length}
          </div>

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
        </div>

        <div className="mattress-quiz__progress">
          <div
            className="mattress-quiz__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mattress-quiz__content">
          <h2 className="mattress-quiz__title">{currentStepData.title}</h2>

          {currentStepData.isSize ? (
            <div className="mattress-quiz__sizes">
              <div className="mattress-quiz__options mattress-quiz__options--sizes">
                {popularSizes.map((option) => (
                  <button
                    key={option.value}
                    className={`mattress-quiz__option mattress-quiz__option--size ${
                      answers[currentStepData.id] === option.value
                        ? "mattress-quiz__option--selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectOption(currentStepData.id, option.value)
                    }
                  >
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

              <button
                className="mattress-quiz__toggle-sizes"
                onClick={() => setShowAllSizes(!showAllSizes)}
              >
                {showAllSizes ? (
                  <>
                    <ChevronUp size={20} />
                    Приховати інші розміри
                  </>
                ) : (
                  <>
                    <ChevronDown size={20} />
                    Показати всі розміри ({otherSizes.length})
                  </>
                )}
              </button>

              {showAllSizes && (
                <div className="mattress-quiz__options mattress-quiz__options--all-sizes">
                  {otherSizes.map((option) => (
                    <button
                      key={option.value}
                      className={`mattress-quiz__option mattress-quiz__option--size mattress-quiz__option--compact ${
                        answers[currentStepData.id] === option.value
                          ? "mattress-quiz__option--selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleSelectOption(currentStepData.id, option.value)
                      }
                    >
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
              )}
            </div>
          ) : (
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
          )}
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
