'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '../../context/AuthContext';
import { fetchAuthors } from '@/app/lib/api/APIoperations';

const DashboardPage = () => {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        console.log('DashboardPage user:', user);
        console.log('DashboardPage loading:', loading);

        if (!loading && !user) {
            console.log('No user found, redirecting...');
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return null; // Prevent rendering if user is null
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
            <p className="text-lg">You are logged in as User ID: {user.id}</p>
        </div>
    );
};

export default DashboardPage;
