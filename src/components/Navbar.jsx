import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Bingo Game
        </Link>
        <div>
          {user ? (
            <>
              <span className="text-light mr-3">Hello, {user.email}</span>
              <button className="btn btn-outline-light" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="btn btn-light" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
