const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchFromApi(endpoint: string, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, options);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Something went wrong');
    }

    return response.json();
}

export const loginUser = async (email: string, password: string) => {
    console.log('loginUser called'); // Debugging if the function is being called
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL); // Debugging
    console.log('Email:', email); // Debugging
    console.log('Password:', password); // Debugging

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
    }

    return response.json(); // Returns { access, refresh }
};

// Fetch user data using the access token
// apioperations.tsx
export async function fetchUserData(userId: number) {
    // Get the token from localStorage (or wherever it's stored)
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        throw new Error('No access token found');
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/profile/${userId}/`;  // Correct URL construction

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,  // Add the Bearer token to the headers
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch user data');
    }

    return response.json();
}


export async function updateUserData(userId: number, formData: any) {
    const accessToken = localStorage.getItem('access_token');  // Get the access token from localStorage

    if (!accessToken) {
        throw new Error('No access token found');
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/profile/update/${userId}/`;  // Correct URL construction

    // Prepare the data as JSON, excluding profile_pic
    const dataToSend: any = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        about: formData.about,
    };

    // Create a FormData object for multipart/form-data if profile_pic exists
    const formDataToSend = new FormData();
    Object.entries(dataToSend).forEach(([key, value]) => {
        if (typeof value === 'string' || value instanceof Blob) {
            formDataToSend.append(key, value);
        } else {
            formDataToSend.append(key, JSON.stringify(value));
        }
    });

    // Append profile_pic if exists
    if (formData.profile_pic) {
        formDataToSend.append('profile_pic', formData.profile_pic);
    }

    // Make the PATCH request
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,  // Include the Bearer token here
            // Do not manually set the 'Content-Type' because FormData will automatically set it
        },
        body: formDataToSend,  // Send FormData if profile_pic exists
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile');
    }

    return response.json();  // Return the updated user data
}
// apioperations.tsx

export async function fetchUserBooks() {
    // Get the token from localStorage (or wherever it's stored)
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        throw new Error('No access token found');
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/user/books/`;  // The endpoint for user books

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,  // Add the Bearer token to the headers
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch user books');
    }
    return response.json();  // Returns the list of user books
}

export const updateUserBook = async (bookId: number, updatedBookData: any) => {
    const response = await fetch(`/api/v1/user-books/${bookId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedBookData),
    });

    if (!response.ok) {
        throw new Error('Failed to update the book');
    }

    return await response.json();
};
