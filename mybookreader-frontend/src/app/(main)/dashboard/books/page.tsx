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
                console.log(booksWithAuthorDetails);
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
    const titleStyle = "text-base font-semibold";
    const spanStyle = "font-normal";
    return (
        <div className="flex flex-col justify-center text-black">
            <h1>My Books</h1>
            <div className="bg-white rounded-lg shadow-md mx-4 bg-gradient-card text-primary">
                {booksWithAuthors.map((book) => (
                    <div key={book.id} className="flex flex-row p-2 border-b-2 border-gray-200">
                        <div className="w-1/3 flex items-center justify-center">
                            <img src={book.cover_image} alt={book.title} className="size-20" />
                        </div>
                        <div className="w-2/3">
                            <div className={titleStyle}>Titre: <span className={spanStyle}>{book.title}</span></div>
                            <div className={titleStyle}>Auteur: <span className={spanStyle}>{book.authorDetails ? book.authorDetails.name : 'Chargement de l\'auteur...'}</span></div>
                            <div className={titleStyle}>Description: <span className={spanStyle}>{book.description}</span></div>
                            <div className={titleStyle}>Note: <span className={spanStyle}>{book.rating}</span></div>
                            <div> { }</div>
                        </div>
                        <div className="w-1/3 flex items-center justify-center">
                            <button
                                onClick={() => handleAddReview(book.id)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Ajouter un Avis
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBooks;
