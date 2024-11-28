'use client';
import { createContext, useState, useEffect, ReactNode } from 'react';
import { refreshAccessToken } from '../lib/api/utility';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface User {
    id: number;
}

interface AuthContextProps {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    getAccessToken: () => Promise<string | null>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    login: async () => { },
    logout: () => { },
    getAccessToken: async () => null,
    loading: false,
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (token && refreshToken) {
            try {
                const decodedToken = jwtDecode<JwtPayload & { user_id: number }>(token);
                const currentTime = Date.now() / 1000;

                // Check if the token is expired
                if (decodedToken.exp && decodedToken.exp > currentTime) {
                    setUser({ id: decodedToken.user_id });
                    setAccessToken(token);
                } else {
                    console.log('Token expired, attempting to refresh');
                    refreshAccessToken().then(newToken => {
                        if (newToken) {
                            setAccessToken(newToken);
                            const newDecodedToken = jwtDecode<JwtPayload & { user_id: number }>(newToken);
                            setUser({ id: newDecodedToken.user_id });
                        } else {
                            console.error('Failed to refresh token');
                        }
                    });
                }
            } catch (err) {
                console.error('Error decoding token:', err);
            }
        } else {
            console.log('No valid tokens found');
        }

        setLoading(false);
    }, []);

    // Login function
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            setAccessToken(data.access);

            const decodedToken = jwtDecode<JwtPayload & { user_id: number }>(data.access);
            setUser({ id: decodedToken.user_id });
        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setAccessToken(null);
        setUser(null);
    };

    // Get access token (using refresh if necessary)
    const getAccessToken = async () => {
        if (accessToken) {
            return accessToken;
        }

        try {
            const newAccessToken = await refreshAccessToken();
            setAccessToken(newAccessToken);
            return newAccessToken;
        } catch (err) {
            console.error('Error refreshing token:', err);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, getAccessToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
