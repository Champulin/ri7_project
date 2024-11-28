'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { refreshAccessToken } from '../lib/api/utility'; // Assuming you have this in utils
import { jwtDecode, JwtPayload } from 'jwt-decode';
// Define the user and context types
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
    // Load tokens and user state when the app initializes


    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        console.log('Tokens at initialization:', { token, refreshToken });

        if (token && refreshToken) {
            try {
                const decodedToken = jwtDecode<JwtPayload & { user_id: number }>(token);
                console.log('Decoded Token:', decodedToken);

                const currentTime = Date.now() / 1000;
                if (decodedToken.exp && decodedToken.exp > currentTime) {
                    console.log('Setting user in context with user_id:', { user_id: decodedToken.user_id });
                    setUser({ id: decodedToken.user_id }); // Simplified user state
                    setAccessToken(token);
                } else {
                    console.log('Token expired, logging out');
                    logout();
                }
            } catch (err) {
                console.error('Error decoding token:', err);
                logout();
            }
        } else {
            console.log('No valid tokens found');
        }

        setLoading(false);
    }, []);


    useEffect(() => {
        console.log('AuthContext user state updated:', user);
    }, [user]);




    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}token/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            console.log('Login response:', data);

            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            setAccessToken(data.access);

            // Decode token or set user info
            setUser({ id: data.user_id }); // Replace with real logic
            console.log('User logged in:', { id: data.user_id });
        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    };


    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setAccessToken(null);
        setUser(null);
    };

    const getAccessToken = async () => {
        if (accessToken) {
            return accessToken;
        }

        try {
            const newAccessToken = await refreshAccessToken();
            setAccessToken(newAccessToken);
            return newAccessToken;
        } catch (err) {
            logout();
            return null;
        }
    };

    // Automatically refresh the access token
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                await refreshAccessToken();
            } catch (err) {
                console.error('Failed to refresh token:', err);
                logout();
            }
        }, 15 * 60 * 1000); // Refresh every 15 minutes (or adjust as needed)

        return () => clearInterval(interval);
    }, [accessToken]);

    return (
        <AuthContext.Provider value={{ user, login, logout, getAccessToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
