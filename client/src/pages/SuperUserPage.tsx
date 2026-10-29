import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export function SuperUserPage() {
    const { token, logout } = useAuth();

    if (!token) return <Navigate to="/" replace />;

    return (
        <div className="app">
            <h1>Super User page</h1>
            <p role="status">Welcome! You are logged in.</p>
            <button className="send-button" onClick={logout}>
                Log out
            </button>
        </div>
    );
}