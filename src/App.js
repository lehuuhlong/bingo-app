import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Bingo from './components/Bingo';
import Register from './pages/Register';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

const PrivateRouteV2 = () => {
  return localStorage.getItem('token') ? <Navigate to="/bingo" /> : <Navigate to="/login" />;
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
                <Bingo />
              </PrivateRoute>
            }
          />
          <Route
            path="/view"
            element={
              <PrivateRoute>
                <Bingo />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<PrivateRouteV2 />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
