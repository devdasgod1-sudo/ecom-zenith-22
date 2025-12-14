
import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

interface User {
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, refresh: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // Check for token on mount
        const token = localStorage.getItem("access_token");
        if (token) {
            setIsAuthenticated(true);
            // Optionally fetch user profile here
            // api.get("/auth/user/").then(res => setUser(res.data)).catch(() => logout());
        }
        setLoading(false);
    }, []);

    const login = (token: string, refresh: string) => {
        localStorage.setItem("access_token", token);
        localStorage.setItem("refresh_token", refresh);
        setIsAuthenticated(true);
        // Fetch user profile if needed
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
