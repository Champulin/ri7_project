const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
    const accessToken = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (!accessToken) {
        throw new Error('Aucun jeton d\'accès trouvé');
    }
    return accessToken;
}
export async function fetchFromApi(endpoint: string, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const accessToken = getAccessToken();

    const defaultHeaders = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };

    const mergedOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options as { headers?: Record<string, string> }).headers
        }
    };

    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Quelque chose s\'est mal passé');
    }

    return response.json();
}
export const createUser = async (email: string, password: string, username: string, firstName: string, lastName: string, about: string, profilePic: File) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('username', username);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('about', about);
    formData.append('profile_pic', profilePic);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/create/`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Échec de la création de l\'utilisateur');
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
        throw new Error(errorData.detail || 'Échec de la connexion');
    }

    return response.json(); // Returns { access, refresh }
};

// Fetch user data using the access token
// apioperations.tsx
export async function fetchUserData(userId: number) {
    const accessToken = getAccessToken();

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
        throw new Error(errorData.detail || 'Échec de la récupération des données utilisateur');
    }

    return response.json();
}


export async function updateUserData(userId: number, formData: any) {
    const accessToken = getAccessToken();

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
        throw new Error(errorData.detail || 'Échec de la mise à jour du profil');
    }

    return response.json();  // Return the updated user data
}
export interface Author {
    id: number;
    name: string;
    bio: string;
    profile_pic: string;
    created_at: string;
    updated_at: string;
}
export async function fetchAuthors(): Promise<Author[]> {
    const response = await fetchFromApi('/authors/');
    return response;
}

export async function fetchAuthor(authorId: number): Promise<Author> {
    const response = await fetchFromApi(`/authors/${authorId}/`);
    return response;
}
export enum ReadingStatus {
    Lu = 'L',
    EnCours = 'E',
    ALire = 'A'
}
export interface Review {
    id: number;
    book: number;
    user: number;
    review: string;
    rating: number;
    reading_status: ReadingStatus;
    created_at: string;
    updated_at: string;
}
export async function fetchReviews(): Promise<Review[]> {
    const response = await fetchFromApi('/reviews/');
    return response;
}
export async function fetchReview(reviewId: number): Promise<Review> {
    const response = await fetchFromApi(`/reviews/${reviewId}/`);
    return response;
}
export async function createReview(review: Review): Promise<Review> {
    const token = getAccessToken();
    console.log('token', token);
    const response = await fetchFromApi('/reviews/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review),
    });
    return response;
}
export async function deleteReview(reviewId: number): Promise<void> {
    await fetchFromApi(`/reviews/${reviewId}/`, { method: 'DELETE' });
}
export async function updateReview(reviewId: number, review: Review): Promise<Review> {
    const token = getAccessToken();
    const response = await fetchFromApi(`/reviews/${reviewId}/`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review),
    });
    return response;
}
export interface Book {
    id: number;
    rating: number;
    author: number;
    title: string;
    description: string;
    cover_image: string;
}
export async function fetchBooks(): Promise<Book[]> {
    const response = await fetchFromApi('/books/');
    return response;
}
export async function fetchBook(bookId: number): Promise<Book> {
    const response = await fetchFromApi(`/books/${bookId}/`);
    return response;
}

