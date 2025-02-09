'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '../../context/AuthContext';
import { fetchUserData } from '@/app/lib/api/APIoperations';

type UserData = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    about?: string;
    profile_pic?: string;
};

const DashboardPage = () => {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);

    const fetchProfile = async () => {
        try {
            if (user && user.id) {
                const data = await fetchUserData(user.id);
                setUserData(data); // Update the state with the fetched data
                console.log('User data:', data);
            }
        } catch (err) {
            console.error('Failed to fetch user data:', err);
        }
    };

    useEffect(() => {
        console.log('DashboardPage user:----------------------------------------------------', user);
        console.log('User contents:----------------------------------------------------', user);
        console.log('DashboardPage loading:', loading);

        if (!loading && !user) {
            console.log('No user found, redirecting...');
            router.push('/login');
        } else {
            fetchProfile();
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
            <h1 className="text-3xl font-bold mb-4">Bienvenu(e) {userData?.username}</h1>
        </div>
    );
};

export default DashboardPage;