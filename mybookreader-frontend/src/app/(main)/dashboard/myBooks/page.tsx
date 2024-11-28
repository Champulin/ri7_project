'use client';

import { useState, useEffect } from 'react';
import { fetchUserBooks, updateUserBook } from '@/app/lib/api/APIoperations'; // Import the fetch function and update function

const MyBooks = () => {
    const [userBooks, setUserBooks] = useState<any[]>([]);  // State to store the books
    const [error, setError] = useState<string>('');  // State to store any errors
    const [loading, setLoading] = useState<boolean>(true);  // State to handle loading status

    // State to manage the book being edited
    const [editingBook, setEditingBook] = useState<any | null>(null);
    const [updatedBook, setUpdatedBook] = useState<any | null>(null);

    // Fetch user books when the component mounts
    useEffect(() => {
        const loadUserBooks = async () => {
            try {
                const books = await fetchUserBooks();  // Fetch books using the API function
                console.log(books);
                setUserBooks(books);  // Store the books in state
            } catch (error) {
                setError('Failed to fetch books');  // Set error if the fetch fails
            } finally {
                setLoading(false);  // Stop loading when the fetch is done
            }
        };

        loadUserBooks();  // Call the function to load the books
    }, []);  // Empty dependency array means this effect runs only once, on mount

    // If the books are still loading, display a loading message
    if (loading) {
        return <p>Loading your books...</p>;
    }

    // If there was an error, display the error message
    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    // Handle edit button click
    const handleEditClick = (book: any) => {
        setEditingBook(book);
        setUpdatedBook(book);  // Copy the book data to the updatedBook state
    };

    // Handle input change for the book fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        setUpdatedBook({
            ...updatedBook,
            [field]: e.target.value,
        });
    };

    // Handle save click to update the book details
    const handleSaveClick = async () => {
        try {
            await updateUserBook(updatedBook.id, updatedBook);  // Update the book via API
            setUserBooks(prevBooks =>
                prevBooks.map(book =>
                    book.id === updatedBook.id ? updatedBook : book
                )
            );
            setEditingBook(null);  // Reset editing mode
        } catch (error) {
            setError('Failed to update the book');
        }
    };

    // Handle cancel click to stop editing
    const handleCancelClick = () => {
        setEditingBook(null);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-black">
            <h1 className="text-3xl font-bold mb-4">My Books</h1>
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Books List</h2>
                {userBooks.length === 0 ? (
                    <p>No books found.</p>  // Display this message if no books are found
                ) : (
                    <ul className="space-y-4">
                        {userBooks.map((book, index) => (
                            <li key={index} className="border-b py-4">
                                {editingBook && editingBook.id === book.id ? (
                                    <div>
                                        {/* Editable fields */}
                                        <h3 className="text-lg font-semibold">
                                            <input
                                                type="text"
                                                value={updatedBook?.title}
                                                onChange={(e) => handleInputChange(e, 'title')}
                                                className="border p-2 rounded"
                                            />
                                        </h3>
                                        <div className="mb-2">
                                            <label>Author:</label>
                                            <input
                                                type="text"
                                                value={updatedBook?.book.author.name}
                                                onChange={(e) => handleInputChange(e, 'book.author.name')}
                                                className="border p-2 rounded"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Review:</label>
                                            <textarea
                                                value={updatedBook?.review}
                                                onChange={(e) => handleInputChange(e, 'review')}
                                                className="border p-2 rounded w-full"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Rating:</label>
                                            <input
                                                type="number"
                                                value={updatedBook?.rating}
                                                onChange={(e) => handleInputChange(e, 'rating')}
                                                className="border p-2 rounded"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Status:</label>
                                            <input
                                                type="text"
                                                value={updatedBook?.reading_status}
                                                onChange={(e) => handleInputChange(e, 'reading_status')}
                                                className="border p-2 rounded"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSaveClick}
                                            className="bg-green-500 text-white py-2 px-4 rounded"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelClick}
                                            className="bg-red-500 text-white py-2 px-4 rounded ml-2"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-lg font-semibold">{book.title}</h3>
                                        <img src={book.book.cover_image} alt={book.title} className="w-20 h-20 rounded-md" />
                                        <p><strong>Author:</strong> {book.book.author.name}</p>
                                        <p><strong>Review:</strong> {book.review}</p>
                                        <p><strong>Rating:</strong> {book.rating}/10</p>
                                        <p><strong>Status:</strong> {book.reading_status}</p>
                                        <p><strong>Created At:</strong> {book.created_at}</p>
                                        <p><strong>Updated At:</strong> {book.updated_at}</p>
                                        <button
                                            onClick={() => handleEditClick(book)}
                                            className="text-blue-500 mt-2"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MyBooks;
