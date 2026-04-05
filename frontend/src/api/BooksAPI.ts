import { type Book } from "../types/Project";

interface fetchBooksResponse {
  books: Book[];
  totalNumBooks: number;

}

const API_URL = 'https://bookproject-hector-backend-ekgtbebkaxdcfdbc.francecentral-01.azurewebsites.net/api/book';

export const fetchBooks = async (
  pageNum: number,
  pageSize: number,
  selectedCategories: string[]
): Promise<fetchBooksResponse> => {

    try{
    const categoryParams = selectedCategories.map((cat) => `bookTypes=${encodeURIComponent(cat)}`).join('&')
    const response = await fetch(`${API_URL}/Books?pageHowMany=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`);

    if(!response.ok){
        throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
        return {
          books: data.books,
          totalNumBooks: data.totalNumBooks
        };
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
    }
};



export const addBook = async (newBook: Book): Promise<Book> => {
    try {
        const response = await fetch(`${API_URL}/AddBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        });
        if (!response.ok) {
            throw new Error(`Failed to add book: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding book:", error);
        throw error;
    }
};



export const updateBook = async (bookID: number, updatedBook: Book): Promise<Book> => {
    try {
        const response = await fetch(`${API_URL}/UpdateBook/${bookID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBook)
        });
        if (!response.ok) {
            throw new Error(`Failed to update book: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating book:", error);
        throw error;
    }
};


export const deleteBook = async (bookId: number): Promise<void> =>{
    try{
        const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Failed to delete book: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error deleting book:", error);
        throw error;

    }
}