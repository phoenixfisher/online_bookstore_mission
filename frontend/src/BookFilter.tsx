import { useEffect, useState } from 'react'

function BookFilter({ 
    selectedCategories, onCheckboxChange 
}: { 
    selectedCategories: string[]; 
    onCheckboxChange: (selectedCategories: string[]) => void 
}) {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:5021/api/Books/GetBookTypes");
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching book categories:", error);
            }
        };

        fetchCategories();
    }, []);

    function handleCheckboxChange({target}: {target: HTMLInputElement}) {
        const updatedCategories = selectedCategories.includes(target.value) ? selectedCategories.filter((c) => c !== target.value) : [...selectedCategories, target.value];
        onCheckboxChange(updatedCategories);
    }

    return (
        <div>
            <h2>Book Categories</h2>
            <div>
                {categories.map((c) => (
                    <div key={c}>
                        <input type="checkbox" id={c} value={c} className="categoryCheckbox" onChange={handleCheckboxChange} />
                        <label htmlFor={c}>{c}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BookFilter;
