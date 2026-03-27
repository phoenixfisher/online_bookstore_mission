import type { CartItem } from './types/Book'

type CartSummaryProps = {
  cart: CartItem[]
  onViewCart: () => void
}

function CartSummary({ cart, onViewCart }: CartSummaryProps) {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0)

  return (
    <div className="card shadow-sm sticky-top summary-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Cart Summary</h2>
          <span className="badge rounded-pill text-bg-primary">{itemCount} items</span>
        </div>

        <p className="mb-2">Total: ${total.toFixed(2)}</p>

        <button className="btn btn-primary w-100" onClick={onViewCart}>
          View Cart
        </button>
      </div>
    </div>
  )
}

export default CartSummary
