import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState, type FormEvent } from "react";
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";

interface UserResponse {
    id: number;
    username: string;
    role: string;
}

export function SuperUserPage() {
    const { token, logout } = useAuth();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [error, setError] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [createError, setCreateError] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const closeCreate = () => {
        setShowCreate(false);
        setNewUsername("");
        setNewPassword("");
        setCreateError("");
    };

    const handleCreated = (created: UserResponse) => {
        setUsers(prev => [...prev, created]);
        closeCreate();
        setNotice({ type: "success", text: `Created user "${created.username}"` });
    };

    async function handleCreate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isCreating) return;
        setCreateError("");
        setIsCreating(true);

        try {
            const res = await fetch("http://localhost:3501/api/User", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username: newUsername, password: newPassword, role: "User" }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || `Fejl: ${res.status}`);
            }

            handleCreated(await res.json());
        } catch (err) {
            setCreateError(err instanceof Error ? err.message : "Could not create user");
        } finally {
            setIsCreating(false);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this user?")) return;

        try {
            const res = await fetch(`http://localhost:3501/api/User/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || `Fejl: ${res.status}`);
            }

            setUsers(prev => prev.filter(u => u.id !== id));
            setNotice({ type: "success", text: "User deleted" });
        } catch (err) {
            setNotice({ type: "error", text: err instanceof Error ? err.message : "Could not delete user" });
        }
    }

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
        <>
            <div className="app">
                <h1>Super User Page</h1>

                <div className="modal-actions" style={{ justifyContent: "center", marginBottom: "1rem" }}>
                    <button type="button" className="send-button" onClick={() => setShowCreate(true)}>
                        + Create user
                    </button>
                </div>

                {notice && (
                    <p className={notice.type === "error" ? "login-error" : "form-success"}>{notice.text}</p>
                )}
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
                            <td>
                                <img
                                    src={deleteIcon}
                                    alt="Delete"
                                    className="small-delete-logo"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleDelete(u.id)}
                                />
                            </td>
                            <td><img src={editIcon} alt="Edit" className="small-edit-logo" /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <button className="send-button" onClick={logout}>Log Out</button>
            </div>

            {showCreate && (
                <div className="modal-backdrop" onClick={closeCreate}>
                    <div
                        className="modal"
                        role="dialog"
                        aria-modal="true"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2>Create user</h2>
                        <form className="login-form" onSubmit={handleCreate} aria-busy={isCreating}>
                            <label htmlFor="new-username">Username</label>
                            <input
                                id="new-username"
                                value={newUsername}
                                onChange={e => setNewUsername(e.target.value)}
                                disabled={isCreating}
                                required
                            />

                            <label htmlFor="new-password">Password</label>
                            <input
                                id="new-password"
                                type="password"
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                disabled={isCreating}
                                required
                            />

                            {createError && <p className="login-error" role="alert">{createError}</p>}

                            <div className="modal-actions">
                                <button type="submit" className="send-button" disabled={isCreating}>
                                    {isCreating ? "Creating…" : "Create"}
                                </button>
                                <button type="button" className="send-button secondary" onClick={closeCreate} disabled={isCreating}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}