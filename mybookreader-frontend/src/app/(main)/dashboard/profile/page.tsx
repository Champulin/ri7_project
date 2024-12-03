'use client';

import { useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserData, updateUserData } from '@/app/lib/api/APIoperations';
import AuthContext from '@/app/context/AuthContext';
import Image from 'next/image';

type UserData = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    about?: string;
    profile_pic?: string;
};

const ProfilePage = () => {
    const { user, loading, logout } = useContext(AuthContext);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        about: '',
        profile_pic: null as File | null,
    });
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const router = useRouter();

    const fetchProfileData = useCallback(async () => {
        if (user && user.id) {
            try {
                const data = await fetchUserData(user.id);
                setUserData(data);

                setFormData({
                    username: data.username,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    about: data.about || '',
                    profile_pic: null,
                });
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Error fetching user data:', error.message);
                    setError('Error fetching profile data');
                } else {
                    setError('An unknown error occurred while fetching profile data');
                }
            }
        }
    }, [user]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError('User not found');
            return;
        }
        try {
            await updateUserData(user.id, formData);
            setSuccessMessage('Profil mis à jour avec succès');
            setIsEditing(false);
            fetchProfileData();

            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error updating profile:', error.message);
                setError('Failed to update profile, please try again');
            } else {
                setError('An unknown error occurred while updating the profile');
            }
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setFormData({ ...formData, profile_pic: file });
        }
    };

    if (loading || !userData) {
        return <p>Loading...</p>;
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-primary font-poppins">
            <h1 className="text-formideo-white font-poppins text-3xl font-bold">Votre Profil</h1>

            <div className="w-full max-w-lg p-6 rounded-lg shadow-md bg-formideo-custom-gradient">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-tertiary">{successMessage}</p>}

                {!isEditing ? (
                    <div className="space-y-4">
                        <p><strong>Name:</strong> {userData.username}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>First Name:</strong> {userData.first_name}</p>
                        <p><strong>Last Name:</strong> {userData.last_name}</p>
                        <p><strong>About:</strong> {userData.about || 'No description'}</p>
                        {userData.profile_pic && (
                            <div>
                                <strong>Profile Picture:</strong>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${userData.profile_pic}`}
                                    height={100}
                                    width={100}
                                    alt="Profile Pic"
                                    className="w-32 h-32 rounded-full"
                                />
                            </div>
                        )}
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Editable form inputs */}
                        <div>
                            <div>
                                <label htmlFor="username" className="block font-medium">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block font-medium">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label htmlFor="first_name" className="block font-medium">First Name</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block font-medium">Last Name</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label htmlFor="about" className="block font-medium">About</label>
                                <textarea
                                    id="about"
                                    value={formData.about}
                                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <label htmlFor="profile_pic" className="block font-medium">Profile Picture</label>
                            <input
                                type="file"
                                id="profile_pic"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="input"
                            />
                            {imagePreview && (
                                <div>
                                    <strong>Preview:</strong>
                                    <Image
                                        src={imagePreview}
                                        width={100}
                                        height={100}
                                        alt="Preview"
                                        className="w-32 h-32 rounded-full mt-2"
                                    />
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                            Save Changes
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
