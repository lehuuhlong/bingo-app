import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Bingo from './pages/Bingo';
import Register from './pages/Register';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { CallNumbersProvider } from './context/CallNumbersContext';
import { CloseBingoProvider } from './context/CloseBingoContext';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/bingo"
            element={
              <PrivateRoute>
                <CallNumbersProvider>
                  <CloseBingoProvider>
                    <Bingo />
                  </CloseBingoProvider>
                </CallNumbersProvider>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/bingo" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
