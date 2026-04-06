import './App.css'
import { useEffect, useState } from 'react'
import BookList from './BookList'
import BookFilter from './BookFilter'
import CartSummary from './CartSummary'
import CartView from './CartView'
import type { Book, CartItem } from './types/Book'
import BookForm from './BookForm'

const CART_STORAGE_KEY = 'bookstore-cart'

function App() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [currentView, setCurrentView] = useState<'shop' | 'cart'>('shop')
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = sessionStorage.getItem(CART_STORAGE_KEY)

    return storedCart ? JSON.parse(storedCart) : []
  })
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const handleSaveBook = async (book: Book) => {
    try {
      const isEditing = !!book.id
      const url = isEditing ? `http://localhost:5021/api/books/${book.id}` : 'http://localhost:5021/api/books'

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      })

      if (response.ok) {
        setEditingBook(null)
        setShowAddForm(false)
        // Books will refresh automatically when BookList re-renders
        window.location.reload() // Simple refresh for now
      } else {
        alert('Failed to save book')
      }
    } catch (error) {
      console.error('Error saving book:', error)
      alert('Failed to save book')
    }
  }

  const handleDeleteBook = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5021/api/books/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Books will refresh automatically when BookList re-renders
        window.location.reload() // Simple refresh for now
      } else {
        alert('Failed to delete book')
      }
    } catch (error) {
      console.error('Error deleting book:', error)
      alert('Failed to delete book')
    }
  }

  useEffect(() => {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (book: Book) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.book.id === book.id)

      if (existingItem) {
        return currentCart.map((item) =>
          item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }

      return [...currentCart, { book, quantity: 1 }]
    })
  }

  const updateQuantity = (bookId: number, quantity: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => (item.book.id === bookId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    )
  }

  const goToCart = () => setCurrentView('cart')
  const continueShopping = () => setCurrentView('shop')

  if (currentView === 'cart') {
    return (
      <CartView
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onContinueShopping={continueShopping}
      />
    )
  }

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-3">
          <BookFilter
            selectedCategories={selectedCategories}
            onCheckboxChange={setSelectedCategories}
          />
        </div>

        <button onClick={() => setShowAddForm(true)}>Add New Book</button>
      
        {showAddForm && (
          <BookForm 
            onSave={handleSaveBook} 
            onCancel={() => setShowAddForm(false)} 
          />
        )}
      
        {editingBook && (
          <BookForm 
            book={editingBook}
            onSave={handleSaveBook} 
            onCancel={() => setEditingBook(null)} 
          />
        )}

        <div className="col-12 col-lg-6">
          <BookList
            selectedCategories={selectedCategories}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onAddToCart={addToCart}
            onEditBook={setEditingBook}
            onDeleteBook={handleDeleteBook}
          />
        </div>

        <div className="col-12 col-lg-3">
          <CartSummary cart={cart} onViewCart={goToCart} />
        </div>
      </div>
    </div>
  )
}

export default App
