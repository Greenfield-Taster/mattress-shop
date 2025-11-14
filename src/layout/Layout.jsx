import Header from "./Header";
import Footer from "./Footer";
import MattressQuiz from "../components/MattressQuiz/MattressQuiz";
import { useQuiz } from "../contexts/QuizContext";

const Layout = ({ children }) => {
  const { isQuizOpen, closeQuiz } = useQuiz();

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
