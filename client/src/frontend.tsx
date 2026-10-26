import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { AuthProvider } from "./auth/AuthProvider";

const elem = document.getElementById("root")!;
const app = (
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>
);

const root = import.meta.hot
    ? (import.meta.hot.data.root ??= createRoot(elem))
    : createRoot(elem);

root.render(app);