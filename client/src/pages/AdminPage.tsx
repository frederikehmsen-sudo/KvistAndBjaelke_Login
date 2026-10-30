import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from "react";
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";


interface UserResponse {
    id: number;
    username: string;
    role: string;
}

export function AdminPage() {
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
            <h1>Admin Page</h1>

            {error && <p className="login-error" role="alert">{error}</p>}

            <table className="user-table">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Delete</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                {users.map(u => (
                    <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.username}</td>
                        <td>{u.role}</td>
                        <td><img src={deleteIcon} alt="Delete" className="small-delete-logo" /></td>
                        <td><img src={editIcon} alt="Edit" className="small-edit-logo" /></td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button className="send-button" onClick={logout}>Log Out</button>
        </div>
    );
}