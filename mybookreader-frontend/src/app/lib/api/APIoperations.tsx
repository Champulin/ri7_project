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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}token/`, {
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
