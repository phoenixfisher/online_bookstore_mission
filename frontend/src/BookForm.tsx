import React from "react";
import type { Book } from "./types/Book";

interface BookFormProps {
    book?: Book
    onSave: (book: Book) => void
    onCancel: () => void
}

function BookForm({ book, onSave, onCancel }: BookFormProps) {
    const [formData, setFormData] = React.useState<Book>({
        title: book?.title || '',
        author: book?.author || '',
        publisher: book?.publisher || '',
        isbn: book?.isbn || '',
        classification: book?.classification || '',
        category: book?.category || '',
        pages: book?.pages || 0,
        price: book?.price || 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'pages' || name === 'price' ? Number(value) : value }));
    };

    return (
        <form onSubmit={handleSubmit} style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc' }}>
        <h3>{book ? 'Edit Book' : 'Add New Book'}</h3>
        
        <div style={{ marginBottom: '10px' }}>
            <label>Title: </label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
            <label>Author: </label>
            <input type="text" name="author" value={formData.author} onChange={handleChange} required />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
            <label>Publisher: </label>
            <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} required />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
            <label>ISBN: </label>
            <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} required />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
            <label>Classification: </label>
            <input type="text" name="classification" value={formData.classification} onChange={handleChange} required />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
            <label>Category: </label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
            <label>Pages: </label>
            <input type="number" name="pages" value={formData.pages} onChange={handleChange} required />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
            <label>Price: </label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
}

export default BookForm