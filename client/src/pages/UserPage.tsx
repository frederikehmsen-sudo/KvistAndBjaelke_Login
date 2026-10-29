import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

interface UserResponse {
    id: number;
    username: string;
    role: string;
}

export function UserPage() {
    const { token, logout } = useAuth();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) return;

        fetch("http://localhost:3501/api/User", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) throw new Error(`Fejl: ${res.status}`);
                return res.json();
            })
            .then((data: UserResponse[]) =>
                setUsers(data))
            .catch(err => setError(err.message));
    }, [token]);

    if (!token) return <Navigate to="/" replace />;

    return (
        <div className="app">
            <h1>User page</h1>

            {error && <p role="alert">{error}</p>}

            <ul>
                {users.map(u => (
                    <li key={u.id}>{u.username}</li>
                ))}
            </ul>

            <button className="send-button" onClick={logout}>Log out</button>
        </div>
    );
}