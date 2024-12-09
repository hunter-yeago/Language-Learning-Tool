import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import WordBankForm from './WordBankForm';

export default function WordBuckets() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        words: [],
    });


    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.title.trim() === '') {
            alert('Please provide a title for the Word Bank.');
            return;
        }
        post('/word_buckets', {
            onSuccess: () => alert('Word Bank created successfully!'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-semibold text-gray-800">
                    Create New Word Bank
                </h2>
            }
        >
            <Head title="Word Buckets" />
            <div className="flex items-center justify-center mt-12">
                <div className="w-full max-w-2xl p-6 bg-white shadow-md rounded-lg flex space-x-4">
                    <WordBankForm
                        data={data}
                        setData={setData}
                        handleSubmit={handleSubmit}
                        processing={processing}
                        errors={errors}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
