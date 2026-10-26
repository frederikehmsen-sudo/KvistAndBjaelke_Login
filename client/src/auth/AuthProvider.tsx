import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import type { LoginRequest } from "../models/login-request";
import type { LoginResponse } from "../models/login-response";

interface AuthContextValue {
    token: string | null;
    login: (request: LoginRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() =>
        sessionStorage.getItem("token"),
    );

    async function login(request: LoginRequest) {
        let response: Response;

        try {
            response = await fetch("http://localhost:3501/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request),
            });
        } catch {
            throw new Error("Could not reach the server. Please try again.");
        }

        if (response.status === 401) {
            throw new Error("Incorrect username or password.");
        }

        if (!response.ok) {
            throw new Error("Login failed. Please try again later.");
        }

        const data: LoginResponse = await response.json();

        if (typeof data.token !== "string" || !data.token) {
            throw new Error("The server returned an invalid token.");
        }

        sessionStorage.setItem("token", data.token);
        setToken(data.token);
    }

    function logout() {
        sessionStorage.removeItem("token");
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider.");
    }

    return context;
}