import {useState, useEffect} from "react";
import type { Book } from '../types/Project';
import { useNavigate } from "react-router-dom";

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
const [totalItems, setTotalItems] = useState<number>(0);
const [totalPages, setTotalPages] = useState<number>(0);
const navigate = useNavigate();


useEffect(() => {
    const fetchBooks = async() => {

        const categoryParams = selectedCategories.map((cat) => `bookTypes=${encodeURIComponent(cat)}`).join('&')
        const response = await fetch(`https://localhost:5000/api/book/Books?pageHowMany=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`);
        const data = await response.json();
        setBooks(data.books);
        setTotalItems(data.totalNumBooks);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };


    fetchBooks()
}, [pageSize, pageNum, selectedCategories]);

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

         <button  disabled={pageNum === 1} onClick={() =>setPageNum(pageNum - 1)}>Previous</button> 
         
         {[...Array(totalPages)].map((_, index) =>(
            <button key={index + 1} onClick={() => setPageNum(index + 1)}  disabled={pageNum === (index + 1)}>{index + 1}</button>
         ))}
        <button disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum + 1)}>Next</button>

        <br></br>
        <label>
            Results per page:
            <select value={pageSize} 
            onChange={(p) => {
            setPageSize(Number(p.target.value));
            setPageNum(1);
            }}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
            </select>
        </label>
        <p>Total books: {totalItems}</p>
        </>
    );
}

export default ProjectList;