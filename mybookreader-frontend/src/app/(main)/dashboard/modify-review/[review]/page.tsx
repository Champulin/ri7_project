'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchReview, fetchBook, fetchAuthor, updateReview, Review, Book, Author, ReadingStatus } from '@/app/lib/api/APIoperations';
import Image from 'next/image';

const ModifyReviewPage = () => {
    const router = useRouter();
    const { review } = useParams();
    const reviewId = parseInt(review as string);
    const [reviewData, setReviewData] = useState<Review | null>(null);
    const [book, setBook] = useState<Book | null>(null);
    const [author, setAuthor] = useState<Author | null>(null);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState<number>(0);
    const [readingStatus, setReadingStatus] = useState<ReadingStatus>(ReadingStatus.ALire);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getReviewData = async () => {
            try {
                const reviewData = await fetchReview(reviewId);
                setReviewData(reviewData);
                setNewReview(reviewData.review);
                setRating(reviewData.rating);
                setReadingStatus(reviewData.reading_status);

                const bookData = await fetchBook(reviewData.book);
                setBook(bookData);

                const authorData = await fetchAuthor(bookData.author);
                setAuthor(authorData);
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Erreur lors de la récupération de l&apos;avis:', error.message);
                } else {
                    console.error('Une erreur inconnue est survenue');
                }
            } finally {
                setLoading(false);
            }
        };

        getReviewData();
    }, [reviewId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reviewData) {
            alert('Données d&apos;avis invalides');
            return;
        }

        try {
            const updatedReview: Partial<Review> = {
                ...reviewData,
                review: newReview,
                rating,
                reading_status: readingStatus
            };

            await updateReview(reviewId, updatedReview as Review);
            alert('Avis modifié avec succès!');
            router.push('/dashboard/user-reviews'); // Rediriger vers la page des avis utilisateur après la soumission
        } catch (error) {
            if (error instanceof Error) {
                console.error('Erreur lors de la modification de l&apos;avis:', error.message);
                alert(`Échec de la modification de l'avis: ${error.message}`);
            } else {
                console.error('Une erreur inconnue est survenue');
                alert('Une erreur inconnue est survenue');
            }
        }
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center text-primary font-poppins">
            <h1 className="text-formideo-white font-poppins text-3xl font-bold">
                Modifier l&apos;Avis
            </h1>
            <form onSubmit={handleSubmit} className="p-4 bg-gradient-card rounded-lg shadow-md w-1/2">
                <div className="flex flex-row gap-4">
                    <div className="w-1/2">
                        {book && (
                            <Image src={book.cover_image} width={100} height={100} alt={book.title} className="w-full h-auto" />
                        )}
                    </div>
                    <div className="w-1/2 font-bold flex flex-col gap-2">
                        <h2 className="text-base">Titre : <span className="font-normal">{book?.title}</span></h2>
                        <p className="text-base">Auteur : <span className="font-normal">{author?.name}</span></p>
                        <div className="flex flex-row items-center">
                            <p className="w-1/4">Note</p>
                            <select
                                className="w-3/4 border rounded h-[30px]"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-row">
                            <p className="w-2/5">Statut de lecture</p>
                            <select
                                className="w-3/5 h-[30px]"
                                value={readingStatus}
                                onChange={(e) => setReadingStatus(e.target.value as ReadingStatus)}
                            >
                                <option value={ReadingStatus.ALire}>À lire</option>
                                <option value={ReadingStatus.EnCours}>En cours</option>
                                <option value={ReadingStatus.Lu}>Lu</option>
                            </select>
                        </div>
                    </div>
                </div>
                <textarea
                    className="w-full border p-2 rounded my-4"
                    placeholder="Écrire votre avis"
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                ></textarea>
                <button
                    type="submit"
                    className="bg-formideo-custom-gradient text-formideo-white font-poppins font-semibold px-4 py-2 rounded-md"
                >
                    Modifier l&apos;Avis
                </button>
            </form>
        </div>
    );
};

export default ModifyReviewPage;
