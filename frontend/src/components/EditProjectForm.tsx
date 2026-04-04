import { use, useState } from "react";
import type { Book } from "../types/Project";
import { updateBook } from "../api/BooksAPI";

interface EditProjectFormProps {
    book: Book;
    onSucess: () => void;
    onCancel: () => void;
}

const EditProjectForm = ({ book, onSucess, onCancel }: EditProjectFormProps) => {

    const [FormData, setFormData] = useState<Book>({...book});


const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...FormData, [e.target.name]: e.target.value})
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBook(FormData.bookID, FormData);
    onSucess();
};


    return (
        <form onSubmit={handleSubmit}>
            <h1>Add New book</h1>
            <label htmlFor="title">Title: <input type="text" name="title" value={FormData.title} onChange={handleChange} /></label>
            <label htmlFor="author">Author: <input type="text" name="author" value={FormData.author} onChange={handleChange} /></label>
            <label htmlFor="publisher">Publisher: <input type="text" name="publisher" value={FormData.publisher} onChange={handleChange} /></label>
            <label htmlFor="isbn">ISBN: <input type="text" name="isbn" value={FormData.isbn} onChange={handleChange} /></label>
            <label htmlFor="classification">Classification: <input type="text" name="classification" value={FormData.classification} onChange={handleChange} /></label>
            <label htmlFor="category">Category: <input type="text" name="category" value={FormData.category} onChange={handleChange} /></label>
            <label htmlFor="pageCount">Page Count: <input type="number" name="pageCount" value={FormData.pageCount} onChange={handleChange} /></label>
            <label htmlFor="price">Price: <input type="number" name="price" value={FormData.price} onChange={handleChange} step="0.01" /></label>
            <button type="submit" className="btn btn-primary mt-3 ml-2" >Update Book</button>
            <button type="button" className="btn btn-secondary mt-3 ml-2" onClick={onCancel}>Cancel</button>
        </form>
    );
};



export default EditProjectForm;