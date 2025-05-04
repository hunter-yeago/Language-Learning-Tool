export default function DictionarySearchForm({searchDictionary, wordToSearch, setWordToSearch, error}) {

  return(
      <form className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md space-y-4" onSubmit={searchDictionary}>
          <label className="block text-lg font-medium text-gray-700">Search Dictionary:</label>
          <div className="flex gap-2">
              <input
                  type="text"
                  value={wordToSearch}
                  onChange={(e) => setWordToSearch(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                  Search
              </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
  )
}