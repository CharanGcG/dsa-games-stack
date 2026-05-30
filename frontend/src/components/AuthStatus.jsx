import { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";

const AuthStatus = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [modalMode, setModalMode] = useState(null);

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {isLoggedIn ? (
          <>
            <span className="hidden max-w-40 truncate text-sm text-gray-300 sm:inline">
              {user.username}
            </span>
            <Link
              to="/progress"
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Progress
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-gray-600 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setModalMode("login")}
              className="rounded-lg border border-gray-600 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setModalMode("register")}
              className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500"
            >
              Register
            </button>
          </>
        )}
      </div>

      {modalMode && (
        <AuthModal mode={modalMode} onClose={() => setModalMode(null)} />
      )}
    </>
  );
};

export default AuthStatus;
