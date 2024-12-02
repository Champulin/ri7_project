'use client';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Author, Book, fetchAuthor, fetchBooks } from '@/app/lib/api/APIoperations';
import AuthContext from '@/app/context/AuthContext';

const MyBooks = () => {
    const { user, loading } = useContext(AuthContext);
    const [booksWithAuthors, setBooksWithAuthors] = useState<(Book & { authorDetails?: Author })[]>([]);
    const router = useRouter();

    useEffect(() => {
        const loadBooksAndAuthors = async () => {
            try {
                const booksData = await fetchBooks();
                const booksWithAuthorDetails = await Promise.all(
                    booksData.map(async (book) => {
                        const authorDetails = await fetchAuthor(book.author);
                        return { ...book, authorDetails };
                    })
                );
                setBooksWithAuthors(booksWithAuthorDetails);
            } catch (error) {
                console.error('Error fetching books or authors:', error);
            }
        };

        loadBooksAndAuthors();
    }, []);

    const handleAddReview = (bookId: number) => {
        if (!user) {
            alert('Please log in to add a review.');
            return;
        }
        router.push(`/dashboard/review-form?bookId=${bookId}&userId=${user.id}`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-black">
            <h1>My Books</h1>
            <div className="p-4 bg-white rounded-lg shadow-md">
                {booksWithAuthors.map((book) => (
                    <div key={book.id} className="flex flex-row p-2 border-b-2 border-gray-200">
                        <div className="w-1/3 flex items-center justify-center">
                            <img src={book.cover_image} alt={book.title} className="size-20" />
                        </div>
                        <div className="w-2/3">
                            <div>{book.title}</div>
                            <div>{book.authorDetails ? book.authorDetails.name : 'Loading author...'}</div>
                            <div>{book.description}</div>
                        </div>
                        <div className="w-1/3 flex items-center justify-center">
                            <button
                                onClick={() => handleAddReview(book.id)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Add Review
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBooks;
