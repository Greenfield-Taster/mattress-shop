import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MattressQuiz from "../components/MattressQuiz/MattressQuiz";
import { useQuiz } from "../hooks/useQuiz";

const Layout = ({ children }) => {
  const { isQuizOpen, closeQuiz } = useQuiz();

  // Блокування скролу коли модальне вікно відкрите
  useEffect(() => {
    if (isQuizOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    // Очищення при розмонтуванні
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isQuizOpen]);

  return (
    <div className="app">
      <Header />
      <main className="main">{children}</main>
      <Footer />
      {isQuizOpen && <MattressQuiz onClose={closeQuiz} />}
    </div>
  );
};

export default Layout;
