export interface Book {
  id: number
  title: string
  author: string
  publisher: string
  isbn: string
  category: string
  pages: number
  price: number
}

export interface BooksResponse {
  books: Book[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
