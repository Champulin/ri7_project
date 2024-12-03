import { Suspense } from 'react';
import ReviewForm from '@/app/components/ReviewForm';

const ReviewFormPage = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ReviewForm />
        </Suspense>
    );
};

export default ReviewFormPage;
