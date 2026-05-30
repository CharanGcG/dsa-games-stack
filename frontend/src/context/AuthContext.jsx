import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe, loginUser, registerUser } from "../lib/api";

const STORAGE_KEY = "dsaGamesAuth";
const AuthContext = createContext(null);

const readStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState(() => readStoredAuth()?.tokens || null);
  const [user, setUser] = useState(() => readStoredAuth()?.user || null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      if (!tokens?.accessToken) {
        setAuthReady(true);
        return;
      }

      try {
        const data = await getMe(tokens.accessToken);
        setUser(data.user);
      } catch {
        setTokens(null);
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setAuthReady(true);
      }
    };

    restoreSession();
  }, [tokens?.accessToken]);

  const persistAuth = (payload) => {
    setUser(payload.user);
    setTokens(payload.tokens);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const login = useCallback(async ({ email, password }) => {
    const payload = await loginUser({ email, password });
    persistAuth(payload);
    return payload.user;
  }, []);

  const register = useCallback(async ({ username, email, password }) => {
    const payload = await registerUser({ username, email, password });
    persistAuth(payload);
    return payload.user;
  }, []);

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      authReady,
      user,
      tokens,
      isLoggedIn: Boolean(user && tokens?.accessToken),
      login,
      register,
      logout,
    }),
    [authReady, user, tokens, login, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
};
