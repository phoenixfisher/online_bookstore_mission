import { useEffect, useState } from 'react'
import type { Book, BooksResponse } from './types/Book'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:5021' : '')

function BookList({
  selectedCategories,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onAddToCart,
  onEditBook,
  onDeleteBook,
}: {
  selectedCategories: string[]
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onAddToCart: (book: Book) => void
  onEditBook: (book: Book) => void
  onDeleteBook: (id: number) => void
}) {
  const [books, setBooks] = useState<Book[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const categoryParams = selectedCategories
          .map((cat) => `categories=${encodeURIComponent(cat)}`)
          .join('&')

        const response = await fetch(
          `${API_BASE_URL}/api/books?page=${page}&pageSize=${pageSize}${selectedCategories.length > 0 ? `&${categoryParams}` : ''}`
        )
        const data: BooksResponse = await response.json()

        setBooks(data.books)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    }

    fetchBooks()
  }, [page, pageSize, selectedCategories])

  useEffect(() => {
    onPageChange(1)
  }, [selectedCategories, onPageChange])

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="mb-1">Online Bookstore</h1>
            <p className="text-muted mb-0">Browse books and add them to your cart.</p>
          </div>

          <div>
            <label htmlFor="pageSize" className="form-label">
              Books per page:
            </label>
            <select
              id="pageSize"
              className="form-select"
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value))
                onPageChange(1)
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>
                    <div className="fw-semibold">{book.title}</div>
                    <div className="small text-muted">{book.publisher}</div>
                  </td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td className="text-end">
                    <button className="btn btn-primary btn-sm" onClick={() => onEditBook(book)}>
                      Edit
                    </button>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-danger btn-sm" onClick={() => onDeleteBook(book.id || 0)}>
                      Delete
                    </button>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-success btn-sm" onClick={() => onAddToCart(book)}>
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <p className="mb-0">
            Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total} books
          </p>

          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((currentPage) => (
                <li
                  key={currentPage}
                  className={`page-item ${page === currentPage ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => onPageChange(currentPage)}>
                    {currentPage}
                  </button>
                </li>
              ))}

              <li className={`page-item ${page === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page === totalPages || totalPages === 0}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default BookList
