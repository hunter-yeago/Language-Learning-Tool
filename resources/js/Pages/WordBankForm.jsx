export default function WordBankForm({
    data,
    setData,
    handleSubmit,
    processing,
    errors,
}) {
    return (
        <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-4" method="POST">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Word Bank Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                    {errors.title && (
                        <div className="text-red-500 text-sm">{errors.title}</div>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Description (Optional)
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        rows={4}
                    />
                    {errors.description && (
                        <div className="text-red-500 text-sm">{errors.description}</div>
                    )}
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        {processing ? 'Saving...' : 'Save Word Bank'}
                    </button>
                </div>
            </form>
        </div>
    );
}
