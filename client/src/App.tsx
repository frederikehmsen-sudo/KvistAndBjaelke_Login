import "./index.css";
import { useState, type FormEvent } from "react";
import rammus from "./assets/rammus.png";
import { useAuth } from "./auth/AuthProvider";
import type { LoginRequest } from "./models/login-request";

export function App() {
    const { token, login, logout } = useAuth();
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
            await login(request);
            setPassword("");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Login failed.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="app">
            <div className="logo-container">
                <img src={rammus} alt="Minion" className="logo bun-logo" />
            </div>

            <h1>Login</h1>

            {token ? (
                <div>
                    <p role="status">You are logged in.</p>
                    <button className="send-button" onClick={logout}>
                        Log out
                    </button>
                </div>
            ) : (
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
            )}
        </div>
    );
}

export default App;