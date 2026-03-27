using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult<BooksResponse>> GetBooks(
            int page = 1,
            int pageSize = 5,
            string? sortBy = "title")
        {
            var query = _bookstoreContext.Books.AsQueryable();

            if (string.Equals(sortBy, "title", StringComparison.OrdinalIgnoreCase))
            {
                query = query.OrderBy(b => b.Title);
            }

            var total = await query.CountAsync();
            var books = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new BooksResponse
            {
                Books = books,
                Total = total,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(total / (double)pageSize)
            });
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
