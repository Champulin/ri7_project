'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Author, Book, createReview, fetchAuthor, fetchBook, ReadingStatus, Review } from '@/app/lib/api/APIoperations';

const ReviewForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookId = searchParams.get('bookId');
    const userId = searchParams.get('userId');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState<number>(0);
    const [readingStatus, setReadingStatus] = useState<ReadingStatus>(ReadingStatus.ALire);
    const [book, setBook] = useState<Book>();
    const [author, setAuthor] = useState<Author>();
    useEffect(() => {
        getBookAndAuthor();
    }, []);
    const getBookAndAuthor = async () => {
        if (bookId === null) {
            throw new Error('bookId ne peut pas être nul');
        }
        const bookData = await fetchBook(parseInt(bookId));
        const authorData = await fetchAuthor(bookData.author);
        setBook(bookData);
        setAuthor(authorData);
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!bookId || !userId) {
            alert('ID de livre ou d\'utilisateur invalide');
            return;
        }

        try {
            const newReview: Partial<Review> = {
                book: parseInt(bookId),
                user: parseInt(userId),
                review,
                rating,
                reading_status: ReadingStatus.ALire
            };

            await createReview(newReview as Review);
            alert('Avis ajouté avec succès !');
            router.push('/dashboard/books'); // Rediriger vers une autre page après la soumission
        } catch (error) {
            console.error('Erreur lors de la création de l\'avis :', error);
            alert('Échec de la création de l\'avis.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-primary font-poppins">
            <h1 className='text-formideo-white font-poppins text-3xl font-bold'>Rajouter un Avis</h1>
            <form onSubmit={handleSubmit} className="p-4 bg-formideo-custom-gradient rounded-lg shadow-md w-1/2">
                <div className='flex flex-row gap-4'>
                    <div className='w-1/2'>
                        <img src={book?.cover_image} alt={book?.title} className="w-full h-auto" />
                    </div>
                    <div className='w-1/2 font-bold flex flex-col gap-2'>
                        <h2 className='text-base'>Titre : <span className='font-normal'>{book?.title}</span></h2>
                        <p className='text-base'>Auteur : <span className='font-normal'>{author?.name}</span></p>
                        <div className='flex flex-row items-center'>
                            <p className='w-1/4 '>Note</p>
                            <select
                                className="w-3/4 border p-2 rounded mb-4"
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
                        <div className='flex flex-row'>
                            <p className='w-2/5'>Statut de lecture</p>
                            <select className='w-3/5 h-[30px]' value={readingStatus} onChange={(e) => setReadingStatus(e.target.value as ReadingStatus)}>
                                <option value={ReadingStatus.ALire}>À lire</option>
                                <option value={ReadingStatus.EnCours}>En cours</option>
                                <option value={ReadingStatus.Lu}>Lu</option>
                            </select>
                        </div>
                    </div>
                </div>
                <textarea
                    className="w-full border p-2 rounded my-4"
                    placeholder="Écrivez votre avis"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <button type="submit" className="bg-tertiary text-formideo-white font-poppins font-semibold px-4 py-2 rounded-md">
                    Soumettre l'avis
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
