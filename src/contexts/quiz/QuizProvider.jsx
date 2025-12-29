import { useState, useCallback, useMemo } from "react";
import { QuizContext } from "./QuizContext";

export const QuizProvider = ({ children }) => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const openQuiz = useCallback(() => setIsQuizOpen(true), []);
  const closeQuiz = useCallback(() => setIsQuizOpen(false), []);

  const value = useMemo(
    () => ({
      isQuizOpen,
      openQuiz,
      closeQuiz,
    }),
    [isQuizOpen, openQuiz, closeQuiz]
  );

  return (
    <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
  );
};
