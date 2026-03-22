using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreContext")));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");

// Books endpoint with pagination and sorting
app.MapGet("/api/books", async (BookstoreContext db, int page = 1, int pageSize = 5, string? sortBy = "title") =>
{
    var query = db.Books.AsQueryable();

    // Sort by title or other field
    if (sortBy?.ToLower() == "title")
    {
        query = query.OrderBy(b => b.Title);
    }

    var total = await query.CountAsync();
    var books = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return new
    {
        books,
        total,
        page,
        pageSize,
        totalPages = (int)Math.Ceiling(total / (double)pageSize)
    };
})
.WithName("GetBooks")
.WithOpenApi();

app.Run();