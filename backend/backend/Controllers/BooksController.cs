using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _bookstoreContext;

        public BooksController(BookstoreContext bookstoreContext)
        {
            _bookstoreContext = bookstoreContext;
        }

        [HttpGet]
        public IActionResult GetBooks(int page = 1, int pageSize = 5, [FromQuery] List<string>? categories = null)
        {
            var query = _bookstoreContext.Books.AsQueryable();

            if (categories != null && categories.Count > 0)
            {
                query = query.Where(b => categories.Contains(b.Category));
            }

            query = query.OrderBy(b => b.Title);

            var total = query.Count();
            var books = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new BooksResponse
            {
                Books = books,
                Total = total,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(total / (double)pageSize)
            });
        }

        [HttpGet("GetBookTypes")]
        public IActionResult GetBookTypes()
        {
            var bookTypes = _bookstoreContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(bookTypes);
        }

        [HttpPost]
        public IActionResult CreateBook([FromBody] Book book)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _bookstoreContext.Books.Add(book);
            _bookstoreContext.SaveChanges();

            return CreatedAtAction(nameof(GetBooks), new { id = book.Id }, book);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateBook(int id, [FromBody] Book updatedBook)
        {
            if (id != updatedBook.Id)
                return BadRequest("ID mismatch");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingBook = _bookstoreContext.Books.Find(id);
            if (existingBook == null)
                return NotFound();

            // Update properties
            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.Pages = updatedBook.Pages;
            existingBook.Price = updatedBook.Price;

            _bookstoreContext.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBook(int id)
        {
            var book = _bookstoreContext.Books.Find(id);
            if (book == null)
                return NotFound();

            _bookstoreContext.Books.Remove(book);
            _bookstoreContext.SaveChanges();
            return NoContent();
        }
        
        [HttpGet("{id}")]
        public IActionResult GetBook(int id)
        {
            var book = _bookstoreContext.Books.Find(id);
            if (book == null)
                return NotFound();

            return Ok(book);
        }
    }

    public class BooksResponse
    {
        public List<Book> Books { get; set; } = [];
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
