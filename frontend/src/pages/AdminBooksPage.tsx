import { useEffect, useState } from "react";
import type { Book } from "../types/Project";
import { deleteBook, fetchBooks } from "../api/BooksAPI";
import Pagination from "../components/Pagination";
import NewProjectForm from "../components/NewProjectForm";
import EditProjectForm from "../components/EditProjectForm";

const AdminBooksPage = () => {
        const[books, setBooks] = useState<Book[]>([]);
        const [error, setError] = useState<string | null>(null);
        const [loading, setLoading] = useState(true); 
        const [pageNum, setPageNum] = useState<number>(1);
        const [pageSize, setPageSize] = useState<number>(10);
        const [totalPages, setTotalPages] = useState<number>(0);
        const [showForm, setShowForm] = useState(false);
        const [editingBook, setEditingBook] = useState<Book | null>(null);


    useEffect(() => {
        const loadBooks = async() => {
            try {
                const data = await fetchBooks(pageNum, pageSize, []);
                setBooks(data.books);
                setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        loadBooks();
    }, [pageNum, pageSize]);


    const handleDelete = async (bookID: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this book?");
        if (!confirmDelete) return;
        try {
            await deleteBook(bookID);
            setBooks((prev) => prev.filter((b) => b.bookID !== bookID)); 
        } catch (err) {
            setError((err as Error).message);
        }
    };

    if (loading) {
        return <p>Loading books...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <div>
            <h1>Admin Books</h1>

            {!showForm && (
                <button className="btn btn-success mb-3" onClick={() => setShowForm(true)}>
                    Add New Book
                </button>
            )}

            {showForm && (
                <NewProjectForm onSucess={() => {
                    setShowForm(false);
                    fetchBooks(pageNum, pageSize, []).then((data) => 
                        setBooks(data.books));
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {editingBook && (
                <EditProjectForm book={editingBook} onSucess={() => {
                    setEditingBook(null);
                    fetchBooks(pageNum, pageSize, []).then((data) => 
                        setBooks(data.books));
                    }}
                    onCancel={() => setEditingBook(null)}
                />
            )}



            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>ISBN</th>
                        <th>Classification</th>
                        <th>Category</th>
                        <th>Page Count</th>
                        <th>Price</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.bookID}>
                            <td>{book.bookID}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.publisher}</td>
                            <td>{book.isbn}</td>
                            <td>{book.classification}</td>
                            <td>{book.category}</td>
                            <td>{book.pageCount}</td>
                            <td>${book.price.toFixed(2)}</td>
                            <td><button className="btn btn-primary btn-sm w-100 mb1" onClick={() => setEditingBook(book)}>Edit</button></td>
                            <td><button className="btn btn-danger btn-sm w-100 mb1" onClick={() => handleDelete(book.bookID)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>

            </table>
            <Pagination
                currentPage={pageNum}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPageNum}
                onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                }}
            />
            
        </div>
    );

};
export default AdminBooksPage;
            
            
    