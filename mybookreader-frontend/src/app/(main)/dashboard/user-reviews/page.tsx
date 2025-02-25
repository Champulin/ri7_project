'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { fetchReviews, fetchBook, fetchAuthor, Review, Book, Author } from '@/app/lib/api/APIoperations';
import AuthContext from '@/app/context/AuthContext';
import Image from 'next/image';

const UserReviewsPage = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [books, setBooks] = useState<{ [key: number]: Book }>({});
    const [authors, setAuthors] = useState<{ [key: number]: Author }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        const getReviews = async () => {
            try {
                const reviewsData = await fetchReviews();
                const userReviews = reviewsData.filter(review => review.user === user?.id);
                setReviews(userReviews);

                // Fetch book and author data
                const bookPromises = userReviews.map(review => fetchBook(review.book));
                const booksData = await Promise.all(bookPromises);
                const booksMap = booksData.reduce((acc, book) => ({ ...acc, [book.id]: book }), {});
                setBooks(booksMap);

                const authorPromises = booksData.map(book => fetchAuthor(book.author));
                const authorsData = await Promise.all(authorPromises);
                const authorsMap = authorsData.reduce((acc, author) => ({ ...acc, [author.id]: author }), {});
                setAuthors(authorsMap);

            } catch (error) {
                console.error('Erreur lors de la récupération des avis:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            getReviews();
        }
    }, [user]);

    if (loading) {
        return <p>Chargement...</p>;
    }
    const titleStyle = "text-base font-semibold";
    const spanStyle = "font-normal";
    return (
        <div className="text-formideo-white font-poppins flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Mes Avis</h1>
            {reviews.length === 0 ? (
                <p>Aucun avis trouvé.</p>
            ) : (
                <ul className="w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4 ">
                    {reviews.map((review) => {
                        const book = books[review.book];
                        const author = book ? authors[book.author] : null;
                        return (
                            <li key={review.id} className="border rounded-lg shadow-md bg-gradient-card">
                                {book && (
                                    <div className='flex flex-col gap-x-4'>
                                        <div className='flex flex-row gap-x-4'>

                                            <div className='w-1/2'>
                                                <Image src={book.cover_image} alt={book.title}
                                                    width={100}
                                                    height={100}
                                                    className="w-full h-auto" />
                                            </div>
                                            <div className='w-1/2 p-2 space-y-2'>
                                                <h2 className={titleStyle}>Titre: <span className={spanStyle}>{book.title}</span></h2>
                                                {author && <p className={titleStyle}>Auteur: <span className={spanStyle}>{author.name}</span></p>}
                                                <p className={titleStyle}>Avis: <span className={spanStyle}>{review.review}</span></p>
                                                <p className={titleStyle}>Note: <span className={spanStyle}>{review.rating}</span></p>
                                                <p className={titleStyle}>Statut de lecture: <span className={spanStyle}>{review.reading_status === 'A' ? 'À lire' : review.reading_status === 'E' ? 'En cours' : 'Lu'}</span></p>
                                                <div className='flex flex-row hidden lg:flex'>
                                                    <p className='text-xs'>Créé le: <span className="font-normal">{new Date(review.created_at).toLocaleDateString('fr-FR')}</span></p>
                                                    <p className='text-xs'>Mis à jour le: <span className="font-normal">{new Date(review.updated_at).toLocaleDateString('fr-FR')}</span></p>
                                                </div>
                                                <button onClick={() => router.push(`modify-review/${review.id}`)} className="bg-formideo-custom-gradient text-formideo-white font-poppins font-semibold px-4 py-2 rounded-md hidden lg:flex">Modifier</button>
                                            </div>
                                        </div>
                                        <div className='mx-auto px-4 py-2 lg:hidden'>
                                            <div className='flex flex-row gap-x-4'>
                                                <p className='text-xs'>Créé le: {new Date(review.created_at).toLocaleDateString('fr-FR')}</p>
                                                <p className='text-xs'>Mis à jour le: {new Date(review.updated_at).toLocaleDateString('fr-FR')}</p>
                                            </div>
                                            <button onClick={() => router.push(`modify-review/${review.id}`)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Modifier</button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default UserReviewsPage;
