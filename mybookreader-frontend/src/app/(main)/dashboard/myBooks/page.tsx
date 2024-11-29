'use client';

import { useState, useEffect, useContext } from 'react';
import { fetchAuthors, createBook, fetchUserBooks, createUserBook } from '@/app/lib/api/APIoperations';  // Import necessary functions
import AuthContext from '@/app/context/AuthContext';  // Import AuthContext for user info
import { UserBookData } from '@/app/lib/api/APIoperations';

// Define types for book data and author
interface Author {
    id: number;
    name: string;
}

interface BookData {
    title: string;
    description: string;
    cover_image: File | null;
}


const MyBooks = () => {
    const { user, loading } = useContext(AuthContext);  // Access user from AuthContext
    const [authors, setAuthors] = useState<Author[]>([]);  // State to store authors
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);  // State to store selected author
    const [error, setError] = useState<string>('');  // State to handle errors
    const [bookData, setBookData] = useState<BookData>({  // State to store book data
        title: '',
        description: '',
        cover_image: null,
    });
    const [showForm, setShowForm] = useState<boolean>(false);  // State to handle form visibility
    const [userBooks, setUserBooks] = useState<UserBookData[]>([]);  // State to store user books
    const [review, setReview] = useState<string>('');  // State to store review
    const [rating, setRating] = useState<number>(0);  // State to store rating
    const [readingStatus, setReadingStatus] = useState<string>('A');  // State to store reading status

    // Fetch authors and user books when the component mounts
    useEffect(() => {
        const loadAuthorsAndBooks = async () => {
            try {
                const authors = await fetchAuthors();  // Fetch authors from the API
                setAuthors(authors);  // Set authors in the state

                const books = await fetchUserBooks();  // Fetch user books from the API
                console.log('books:', books);
                setUserBooks(books);  // Set user books in the state
            } catch (error) {
                setError('Échec de la récupération des auteurs ou des livres');
            }
        };

        loadAuthorsAndBooks();  // Load authors and user books when the component mounts
    }, []);

    // Handle changes in the book form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof BookData) => {
        setBookData({
            ...bookData,
            [field]: e.target.value,
        });
    };

    // Handle the author selection change
    const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAuthorId = parseInt(e.target.value);
        const author = authors.find((a) => a.id === selectedAuthorId);
        setSelectedAuthor(author ?? null);  // Set selected author
    };

    // Handle file input for cover image
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setBookData({
                ...bookData,
                cover_image: e.target.files[0],
            });
        }
    };

    const handleCreateBook = async () => {
        const { title, description, cover_image } = bookData;

        if (!selectedAuthor) {
            setError('Please select an author');
            return;
        }

        if (!title || !description || !cover_image) {
            setError('Please fill in all fields');
            return;
        }

        if (!user) {
            setError('No user logged in');
            return;
        }

        try {
            // First, create the book
            const book = await createBook({ title, description, cover_image, authorId: selectedAuthor.id });

            // After the book is created, create the UserBook with the user ID and book ID
            await createUserBook({
                bookId: book.id,
                userId: user.id,
                review: review,
                rating: rating,
                readingStatus: readingStatus
            });

            console.log('Book and UserBook created successfully!');
        } catch (error) {
            setError('Error creating the book or UserBook');
            console.error(error);
        }
    };


    if (loading) {
        return <p>Chargement des auteurs et des livres...</p>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-black">
            <h1 className="text-3xl font-bold mb-4">Mes Livres</h1>

            {error && <p className="text-red-500">{error}</p>}

            <button
                onClick={() => setShowForm(true)}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
            >
                Nouveau Livre
            </button>

            {showForm && (
                <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md mt-4">
                    <h2 className="text-xl font-semibold mb-4">Créer un Nouveau Livre</h2>

                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Titre du Livre
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={bookData.title}
                            onChange={(e) => handleInputChange(e, 'title')}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={bookData.description}
                            onChange={(e) => handleInputChange(e, 'description')}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700">
                            Image de Couverture
                        </label>
                        <input
                            type="file"
                            id="cover_image"
                            name="cover_image"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                            Sélectionner un Auteur
                        </label>
                        <select
                            id="author"
                            name="author"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            onChange={handleAuthorChange}
                        >
                            <option value="">Sélectionner un Auteur</option>
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="review" className="block text-sm font-medium text-gray-700">
                            Revue
                        </label>
                        <textarea
                            id="review"
                            name="review"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                            Note
                        </label>
                        <input
                            type="number"
                            id="rating"
                            name="rating"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value))}
                            min="1"
                            max="10"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="readingStatus" className="block text-sm font-medium text-gray-700">
                            Statut de Lecture
                        </label>
                        <select
                            id="readingStatus"
                            name="readingStatus"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={readingStatus}
                            onChange={(e) => setReadingStatus(e.target.value)}
                        >
                            <option value="L">Lu</option>
                            <option value="E">En cours</option>
                            <option value="A">À lire</option>
                        </select>
                    </div>

                    <button
                        onClick={handleCreateBook}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
                    >
                        Créer le Livre
                    </button>
                </div>
            )}

            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md mt-4">
                <h2 className="text-xl font-semibold mb-4">Mes Livres</h2>
                {/* Display user's books here */}
                {userBooks.map((book) => (
                    <div key={book.id}>
                        <h3>{book.book.title}</h3>
                        <p>{book.book.description}</p>
                        <p>Auteur: {book.author.name}</p>
                        <img src={book.book.cover_image} alt={`Couverture de ${book.book.title}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBooks;
