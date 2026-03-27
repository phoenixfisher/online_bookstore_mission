import './App.css'
import BookList from './BookList'
import BookFilter from './BookFilter'
import { useState } from 'react';

function App() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
      
  return (
    <>
      <BookFilter selectedCategories={selectedCategories} onCheckboxChange={setSelectedCategories} />
      <BookList selectedCategories={selectedCategories} />
    </>
  )
}

export default App
