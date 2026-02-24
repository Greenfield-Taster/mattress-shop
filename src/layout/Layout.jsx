import Header from "./Header";
import Footer from "./Footer";
import MattressQuiz from "../components/MattressQuiz/MattressQuiz";
import { useQuiz } from "../hooks/useQuiz";
import useScrollLock from "../hooks/useScrollLock";

const Layout = ({ children }) => {
  const { isQuizOpen, closeQuiz } = useQuiz();

  useScrollLock(isQuizOpen);

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Перейти до контенту
      </a>
      <Header />
      <main className="main" id="main-content">{children}</main>
      <Footer />
      {isQuizOpen && <MattressQuiz onClose={closeQuiz} />}
    </div>
  );
};

export default Layout;
