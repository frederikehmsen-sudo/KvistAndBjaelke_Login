import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export function AdminPage() {
    const { token, role, logout } = useAuth();

    if (!token) return <Navigate to="/" replace />;
    if (role !== "Admin") return <Navigate to="/user" replace />;

    return (
        <div className="app">
            <h1>Admin page</h1>
            <button className="send-button" onClick={logout}>Log out</button>
        </div>
    );
}