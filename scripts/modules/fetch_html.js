export async function fetchHTML(url) {
    try {
        const response = await fetch(url + 'index.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error fetching HTML:', error);
        return null;
    }
}