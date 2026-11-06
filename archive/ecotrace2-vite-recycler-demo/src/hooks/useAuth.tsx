import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    name: string;
    phone: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (phone: string, password: string) => Promise<void>;
    signup: (name: string, phone: string, password: string) => Promise<void>;
    logout: () => void;
    userRole: string | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for localStorage
const getStoredUsers = (): Record<string, { name: string; password: string }> => {
    try {
        return JSON.parse(localStorage.getItem('ecotrace_users') || '{}');
    } catch {
        return {};
    }
};

const getStoredSession = (): User | null => {
    try {
        const session = localStorage.getItem('ecotrace_session');
        return session ? JSON.parse(session) : null;
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [userRole] = useState<string | null>('facility');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const session = getStoredSession();
        if (session) {
            setUser(session);
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = async (phone: string, password: string) => {
        const users = getStoredUsers();
        const storedUser = users[phone];

        if (!storedUser) {
            throw new Error('No account found with this mobile number. Please sign up first.');
        }

        if (storedUser.password !== password) {
            throw new Error('Incorrect password. Please try again.');
        }

        const sessionUser: User = { name: storedUser.name, phone };
        localStorage.setItem('ecotrace_session', JSON.stringify(sessionUser));
        setUser(sessionUser);
        setIsAuthenticated(true);
    };

    const signup = async (name: string, phone: string, password: string) => {
        const users = getStoredUsers();

        if (users[phone]) {
            throw new Error('An account with this mobile number already exists. Please log in.');
        }

        users[phone] = { name, password };
        localStorage.setItem('ecotrace_users', JSON.stringify(users));

        // Auto-login after signup
        const sessionUser: User = { name, phone };
        localStorage.setItem('ecotrace_session', JSON.stringify(sessionUser));
        setUser(sessionUser);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('ecotrace_session');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, userRole, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
