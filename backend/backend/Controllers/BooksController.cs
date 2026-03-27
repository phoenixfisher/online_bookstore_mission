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
        public IActionResult GetBooks(int page = 1, int pageSize = 5)
        {
            var query = _bookstoreContext.Books
                .OrderBy(b => b.Title)
                .AsQueryable();

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
