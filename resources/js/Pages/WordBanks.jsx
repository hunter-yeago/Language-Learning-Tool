import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function WordBanks() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Test
                </h2>
            }
        >
            <Head title="Test" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 h-52 bg-yellow-500 text-gray-900">
                            This is a test
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
