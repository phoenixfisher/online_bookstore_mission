import './App.css'
import { useEffect, useState } from 'react'
import BookList from './BookList'
import BookFilter from './BookFilter'
import CartSummary from './CartSummary'
import CartView from './CartView'
import type { Book, CartItem } from './types/Book'

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

        <div className="col-12 col-lg-6">
          <BookList
            selectedCategories={selectedCategories}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onAddToCart={addToCart}
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
