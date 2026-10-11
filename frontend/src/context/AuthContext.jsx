import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

export const AuthContext = createContext(null);

const clearStoredSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const isTokenExpired = (token) => {
  try {
    const payload = token.split(".")[1];
    const normalized = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decoded = JSON.parse(
      atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="))
    );

    return !decoded.exp || decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const logout = useCallback(() => {
    clearStoredSession();
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (
        savedToken &&
        savedUser &&
        !isTokenExpired(savedToken)
      ) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } else {
        clearStoredSession();
      }
    } catch {
      clearStoredSession();
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => logout();

    const handleStorageChange = (event) => {
      if (event.key === "token" && !event.newValue) {
        logout();
      }
    };

    window.addEventListener(
      "tripverse:unauthorized",
      handleUnauthorized
    );
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "tripverse:unauthorized",
        handleUnauthorized
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [logout]);

  const login = useCallback((userData, jwtToken) => {
    if (!jwtToken || isTokenExpired(jwtToken)) {
      throw new Error("Received an invalid or expired login token.");
    }

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(jwtToken);
    setUser(userData);
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        initializing,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };