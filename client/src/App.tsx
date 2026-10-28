import "./index.css";
import { useState, type FormEvent } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import rammus from "./assets/rammus.png";
import { useAuth } from "./auth/AuthProvider";
import type { LoginRequest } from "./models/login-request";
import { UserPage } from "./pages/UserPage";
import { AdminPage } from "./pages/AdminPage";

const homeFor = (role: string | null) => (role === "Admin" ? "/admin" : "/user");

function LoginPage() {
    const { token, role, login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isLoading) return;

        setError("");
        setIsLoading(true);

        const request: LoginRequest = { username, password };

        try {
            const loggedInRole = await login(request);
            setPassword("");
            navigate(homeFor(loggedInRole));
        } catch (error) {
            setError(error instanceof Error ? error.message : "Login failed.");
        } finally {
            setIsLoading(false);
        }
    }

    
    if (token) return <Navigate to={homeFor(role)} replace />;

    return (
        <div className="app">
            <div className="logo-container">
                <img src={rammus} alt="Minion" className="logo bun-logo" />
            </div>

            <h1>Login</h1>

            <form className="login-form" onSubmit={handleSubmit} aria-busy={isLoading}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    autoComplete="username"
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    disabled={isLoading}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    disabled={isLoading}
                    required
                />

                {error && <p className="login-error" role="alert">{error}</p>}

                <button className="send-button" type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in…" : "Log in"}
                </button>
            </form>
        </div>
    );
}

export function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;