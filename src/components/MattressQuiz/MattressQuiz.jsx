import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./MattressQuiz.scss";

const MattressQuiz = ({ onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    type: null,
    size: null,
    hardness: null,
    load: null,
  });
  const [isComplete, setIsComplete] = useState(false);
  const [showAllSizes, setShowAllSizes] = useState(false);

  // Розміри з каталогу, розділені на категорії
  const allSizes = [
    // King Size XL
    "200х200",
    // King Size
    "180х200",
    "180х190",
    // Двоспальні
    "170х200",
    "170х190",
    "160х200",
    "160х190",
    "150х200",
    "150х190",
    "140х200",
    "140х190",
    // Полуторні
    "120х200",
    "120х190",
    // Односпальні
    "90х200",
    "90х190",
    "80х200",
    "80х190",
    "80х180",
    "80х170",
    "80х160",
    "80х150",
    // Дитячі
    "70х200",
    "70х190",
    "70х180",
    "70х170",
    "70х160",
    "70х150",
    "70х140",
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
  const otherSizes = [
    ...allSizes
      .filter((size) => !popularSizes.some((p) => p.value === size))
      .map((size) => {
        const [width] = size.split("х");
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
      }),

    {
      value: "custom",
      label: "Нестандартний розмір",
      isCustom: true,
    },
  ];

  const steps = [
    {
      id: "type",
      title: "Оберіть тип матрацу",
      options: [
        { value: "springless", label: "Безпружинні" },
        { value: "spring", label: "Пружинні" },
        { value: "children", label: "Дитячі" },
        { value: "topper", label: "Топери" },
        { value: "rolled", label: "Скручені" },
        { value: "accessories", label: "Аксесуари" },
      ],
    },
    {
      id: "size",
      title: "Оберіть розмір матраца",
      isSize: true,
    },
    {
      id: "hardness",
      title: "Яка жорсткість вам потрібна?",
      options: [
        {
          value: "H1",
          label: "H1 — М'який",
          subtitle: "Для сну на боці, вага до 60 кг",
        },
        {
          value: "H2",
          label: "H2 — Помірно м'який",
          subtitle: "Комфортна підтримка, вага 50-70 кг",
        },
        {
          value: "H3",
          label: "H3 — Середньої жорсткості",
          subtitle: "Універсальний, вага 60-90 кг",
        },
        {
          value: "H4",
          label: "H4 — Жорсткий",
          subtitle: "При болях у спині, вага 90-120 кг",
        },
        {
          value: "H5",
          label: "H5 — Дуже жорсткий",
          subtitle: "Максимальна підтримка, вага 120+ кг",
        },
      ],
    },
    {
      id: "load",
      title: "Навантаження на спальне місце",
      options: [
        {
          value: "light",
          label: "До 80 кг",
          subtitle: "Легке навантаження",
        },
        {
          value: "medium",
          label: "80-150 кг",
          subtitle: "Середнє навантаження",
        },
        {
          value: "unlimited",
          label: "Без обмеження навантаження",
          subtitle: "Максимальна міцність",
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
    const params = new URLSearchParams();

    if (answers.type) {
      params.append("types", answers.type);
    }
    if (answers.size) {
      params.append("sizes", answers.size);
    }
    if (answers.hardness) {
      params.append("hardness", answers.hardness);
    }
    if (answers.load) {
      if (answers.load === "light") {
        params.append("maxWeight", "<=80");
      } else if (answers.load === "medium") {
        params.append("maxWeight", "<=150");
      }
      // "unlimited" — не додаємо обмеження
    }

    navigate(`/catalog?${params.toString()}`);
    if (onClose) onClose();
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({
      type: null,
      size: null,
      hardness: null,
      load: null,
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
                  <span>Тип:</span>{" "}
                  <strong>
                    {steps[0].options.find((o) => o.value === answers.type)
                      ?.label || "Не вибрано"}
                  </strong>
                </li>
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
                    {steps[2].options.find((o) => o.value === answers.hardness)
                      ?.label || "Не вибрано"}
                  </strong>
                </li>
                <li>
                  <span>Навантаження:</span>{" "}
                  <strong>
                    {steps[3].options.find((o) => o.value === answers.load)
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
                        option.isCustom ? "mattress-quiz__option--custom" : ""
                      } ${
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
