'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserData, updateUserData } from '@/app/lib/api/APIoperations';
import AuthContext from '@/app/context/AuthContext';
import Image from 'next/image';

const ProfilePage = () => {
    const { user, loading, logout } = useContext(AuthContext);
    const [userData, setUserData] = useState<any>(null);  // State to hold the fetched user data
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        about: '',
        profile_pic: '',  // This will store the image URL or file
    });
    const [error, setError] = useState<string>('');  // For error handling
    const [successMessage, setSuccessMessage] = useState<string>('');  // For success message
    const [imagePreview, setImagePreview] = useState<string | null>('');  // For previewing the image
    const router = useRouter();

    useEffect(() => {
        const fetchProfileData = async () => {
            if (user && user.id) {
                try {
                    const data = await fetchUserData(user.id);
                    setUserData(data);

                    const profilePicUrl = data.profile_pic
                        ? `${process.env.NEXT_PUBLIC_BASE_URL}${data.profile_pic}`  // Ensure it's a full URL
                        : ''; // Empty string if no profile picture

                    setFormData({
                        username: data.username,
                        email: data.email,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        about: data.about || '',
                        profile_pic: profilePicUrl,
                    });

                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setError('Error fetching profile data');
                }
            }
        };

        fetchProfileData();
    }, [user]);  // Run when `user` changes

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError('User not found');
            return;
        }
        try {
            // If there's a new profile pic, send it along with other form data
            await updateUserData(user.id, formData);
            setSuccessMessage('Profile updated successfully');
            setIsEditing(false);  // Exit edit mode after successful update
        } catch (error) {
            setError('Failed to update profile, please try again');
        }
    };

    const handleLogout = () => {
        logout();  // Calling logout from AuthContext
        router.push('/login');
    };

    // Handle image file change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Get the selected file
        if (file) {
            // Update the preview and the formData
            setImagePreview(URL.createObjectURL(file));  // Preview the image
            setFormData({ ...formData, profile_pic: URL.createObjectURL(file) });  // Update the formData with the selected file as a URL
        }
    };

    if (loading || !userData) {
        return <p>Loading...</p>;
    }

    if (!user) {
        router.push('/login');  // Redirect if the user is not logged in
        return null;  // Prevent rendering before redirect
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Your Profile</h1>

            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}

                {/* Display form or static content based on isEditing */}
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
                                {/* Display the profile picture */}
                                <img
                                    src={formData.profile_pic} // Full URL passed here
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
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <div>
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
                                    <img
                                        src={imagePreview}
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
