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
    role: string | null;
    login: (request: LoginRequest) => Promise<string>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() =>
        sessionStorage.getItem("token"),
    );
    const [role, setRole] = useState<string | null>(() =>
            sessionStorage.getItem("role"),
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
        sessionStorage.setItem("role", data.role);
        setToken(data.token);
        setRole(data.role);
        return data.role;
    }

    function logout() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        setToken(null);
        setRole(null);
    }

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
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