import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DomainSelect from "./pages/DomainSelect";
import Interview from "./pages/Interview";
import InterviewComplete from "./pages/InterviewComplete";
import History from "./pages/History";
import HistoryDetail from "./pages/HistoryDetail";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/domain-select"
              element={
                <ProtectedRoute>
                  <DomainSelect />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview/:id"
              element={
                <ProtectedRoute>
                  <Interview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview/:id/complete"
              element={
                <ProtectedRoute>
                  <InterviewComplete />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history/:id"
              element={
                <ProtectedRoute>
                  <HistoryDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;