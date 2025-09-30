import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PromptGenerator from "./pages/PromptGenerator";
import Results from "./pages/Results";
import History from "./pages/History";
import Navbar from "./components/Navbar";
import { getUserId } from "./utils/auth";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/signup";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/prompt" element={<PromptGenerator />} />
        <Route path="/results" element={<Results />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
