import type { CartItem } from './types/Book'

type CartViewProps = {
  cart: CartItem[]
  onUpdateQuantity: (bookId: number, quantity: number) => void
  onContinueShopping: () => void
}

function CartView({ cart, onUpdateQuantity, onContinueShopping }: CartViewProps) {
  const total = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0)

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Your Cart</h1>
          <p className="text-muted mb-0">Review your books and adjust quantities.</p>
        </div>

        <button className="btn btn-outline-primary" onClick={onContinueShopping}>
          Continue Shopping
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="alert alert-secondary" role="alert">
          Your cart is empty.
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Book</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.book.id}>
                          <td>
                            <div className="fw-semibold">{item.book.title}</div>
                            <div className="text-muted small">{item.book.author}</div>
                          </td>
                          <td>${item.book.price.toFixed(2)}</td>
                          <td>
                            <div className="btn-group" role="group" aria-label={`Quantity controls for ${item.book.title}`}>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => onUpdateQuantity(item.book.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span className="btn btn-light disabled">{item.quantity}</span>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => onUpdateQuantity(item.book.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>${(item.book.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card shadow-sm sticky-top summary-card">
              <div className="card-body">
                <h2 className="h5 mb-3">Order Summary</h2>
                <p className="mb-2">Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                <p className="fw-semibold mb-0">Total: ${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartView
