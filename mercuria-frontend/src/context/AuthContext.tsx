import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { authApi } from "@/api";
import {
  setTokens,
  clearTokens,
  getRefreshToken,
  hasRefreshToken,
} from "@/utils/storage";
import type { User, LoginRequest, RegisterRequest } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "INIT" }
  | { type: "SUCCESS"; user: User }
  | { type: "ERROR"; error: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "INIT":
      return { ...state, isLoading: true, error: null };
    case "SUCCESS":
      return {
        user: action.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "ERROR":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.error,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isInitialized = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      if (!hasRefreshToken()) {
        dispatch({ type: "LOGOUT" });
        return;
      }

      try {
        const refreshToken = getRefreshToken()!;
        const auth = await authApi.refresh(refreshToken);
        setTokens(auth.access_token, auth.refresh_token);
        const user = await authApi.me();
        dispatch({ type: "SUCCESS", user });
      } catch {
        clearTokens();
        dispatch({ type: "LOGOUT" });
      }
    };

    init();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    try {
      const auth = await authApi.login(data);
      setTokens(auth.access_token, auth.refresh_token);
      const user = await authApi.me();
      dispatch({ type: "SUCCESS", user });
    } catch (err: any) {
      const msg = err.response?.data?.error || "Login failed";
      dispatch({ type: "ERROR", error: msg });
      throw err;
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const auth = await authApi.register(data);
      setTokens(auth.access_token, auth.refresh_token);
      const user = await authApi.me();
      dispatch({ type: "SUCCESS", user });
    } catch (err: any) {
      const msg = err.response?.data?.error || "Registration failed";
      dispatch({ type: "ERROR", error: msg });
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    dispatch({ type: "LOGOUT" });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
