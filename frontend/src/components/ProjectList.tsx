import {useState, useEffect, use} from "react";
import type { Book } from '../types/Project';
import { useNavigate } from "react-router-dom";
import { fetchBooks } from "../api/BooksAPI";
import Pagination from "./Pagination";

function ProjectList({
    selectedCategories,
    pageNum,
    pageSize,
    setPageNum,
    setPageSize,
}: {
    selectedCategories: string[];
    pageNum: number;
    pageSize: number;
    setPageNum: (value: number) => void;
    setPageSize: (value: number) => void;
}){
const[books, setBooks] = useState<Book[]>([]);
const [totalPages, setTotalPages] = useState<number>(0);
const navigate = useNavigate();
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState<boolean>(false); 


useEffect(() => {
    const loadBooks = async() => {


        try {
            setLoading(true);
            const data = await fetchBooks(pageNum, pageSize, selectedCategories);

        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
        } catch (error) {
            setError((error as Error).message);
        }finally {
            setLoading(false);
        }
    };


    loadBooks()
}, [pageSize, pageNum, selectedCategories]);

    if (loading) {
        return <p>Loading books...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error loading books: {error}</p>;
    }   

    return(
        <>
        {books.map((b) =>
        <div id="projectCard" className="card mb-3" key={b.bookID}>
            <h3 className="card-title">{b.title}</h3>
                <div className="card-body">
                   <ul className="list-unstyled">
                <li><strong>Author:</strong> {b.author}</li>
                <li><strong>Publisher:</strong> {b.publisher}</li>
                <li><strong>ISBN:</strong> {b.isbn}</li>
                <li><strong>Classification:</strong> {b.classification}</li>
                <li><strong>Category:</strong> {b.category}</li>
                <li><strong>Pages:</strong> {b.pageCount}</li>
                <li><strong>Price:</strong> ${b.price.toFixed(2)}</li>
                    </ul> 

                <button
                    className='btn btn-success'
                    onClick={() =>
                        navigate(`/purchase/${b.title}/${b.bookID}`, {
                            // Pass browse state so cart can return users to this catalog state.
                            state: {
                                returnTo: {
                                    path: "/",
                                    browseState: { selectedCategories, pageNum, pageSize },
                                },
                                unitPrice: b.price,
                            },
                        })
                    }
                >
                    Purchase
                </button>
                </div>
    
            

        </div>
        )}
            <Pagination
            currentPage={pageNum}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPageNum}
            onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPageNum(1); // Reset to first page when page size changes
            }}
            />

        </>
    );
}

export default ProjectList;