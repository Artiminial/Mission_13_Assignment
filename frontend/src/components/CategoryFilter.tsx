import { useEffect, useState } from "react";
import './CategoryFilter.css'

function CategoryFilter({selectedCategories, setSelectedCategories,}: {selectedCategories: string[]; setSelectedCategories: (categories: string[]) => void;})
{

const [categories, setCategories] = useState<string[]>([])

useEffect(() => {
    const fetchCategories = async () => {

        try{
        const response = await fetch('https://localhost:5000/api/book/GetBookTypes');
        const data = await response.json();
        console.log('Fetched the categories:', data);
        setCategories(data);
        }

        catch(error){
            console.error('There was an error fetching the categories', error);
        }
    }
    fetchCategories();
}, []);

    function handleCheckboxChange ({target}: {target: HTMLInputElement}){
        const updatedCategories = selectedCategories.includes(target.value) ? selectedCategories.filter(x => x !== target.value) : [...selectedCategories, target.value];

        setSelectedCategories(updatedCategories);

    }

    return(
      <div className="category-filter">
        <h5>These are the book Types</h5>
        <div className="category-list">
            {categories.map((b) =>(
                <div key={b} className="category-item">
                    <input type="checkbox" id={b} value={b} className="category-checkbox" onChange={handleCheckboxChange}/>   
                    <label htmlFor={b}>{b}</label> 
                </div>      
                ))}
        </div>
      </div>  
    );
}

export default CategoryFilter;