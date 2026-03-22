import { useState, useEffect } from 'react'
import './App.css'

interface Book {
  id: number
  title: string
  author: string
  publisher: string
  isbn: string
  category: string
  pages: number
  price: number
}

interface BooksResponse {
  books: Book[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortBy] = useState('title')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBooks()
  }, [page, pageSize])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `http://localhost:5021/api/books?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}`
      )
      const data: BooksResponse = await response.json()
      setBooks(data.books)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching books:', error)
    }
    setLoading(false)
  }

  return (
    <div className="container mt-5">
      <h1>Online Bookstore</h1>

      <div className="mb-3">
        <label htmlFor="pageSize" className="form-label">
          Books per page:
        </label>
        <select
          id="pageSize"
          className="form-select w-auto"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setPage(1)
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Pages</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.isbn}</td>
                  <td>{book.category}</td>
                  <td>{book.pages}</td>
                  <td>${book.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex align-items-center justify-content-between">
            <div>
              <p>
                Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total} books
              </p>
            </div>
            <nav>
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}

export default App
