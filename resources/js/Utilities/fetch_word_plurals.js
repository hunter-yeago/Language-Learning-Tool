export default async function fetchPluralListFromDictionary(inputWord) {
    try {

        // Make the fetch request without the token
        const response = await fetch(`http://localhost:8000/api/lookup-word/${inputWord.toLowerCase()}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json',},
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        return data.response.entries[0].lexemes;

    } catch (error) {
        console.error('Error fetching plural form: ', error);
    }
}
