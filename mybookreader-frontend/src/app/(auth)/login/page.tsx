'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '../../context/AuthContext';

const LoginPage = () => {
    const { user, login, loading } = useContext(AuthContext);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && user) {
            console.log('User already logged in, redirecting to dashboard...');
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            console.log('Login successful');
            router.push('/dashboard'); // Redirect after successful login
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Wait for AuthContext initialization
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <h1 className="text-xl font-bold mb-4">Login</h1>
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-2 p-2 border"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 p-2 border"
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
