using Microsoft.AspNetCore.Mvc;
using BookProject.API.Data;

namespace BookProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly BookDbContext _bookContext;

        public BookController(BookDbContext temp)
        {
            _bookContext = temp;
        }

        [HttpGet("Books")]
        public IActionResult GetBooks(int pageHowMany = 5, int pageNum = 1, [FromQuery] List<string>? bookTypes = null)
        {
            IQueryable<Book> query = _bookContext.Books.AsQueryable();

            if (bookTypes != null && bookTypes.Any())
            {
                query = query.Where(p => bookTypes.Contains(p.Category));
            }
            var totalNumBooks = query.Count();

            var books = query
                .Skip((pageNum - 1) * pageHowMany)
                .Take(pageHowMany)
                .ToList();

            var response = new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            };

            return Ok(response);
        }
        [HttpGet("GetBookTypes")]
        public IActionResult GetBookTypes()
        {
            var bookTypes = _bookContext.Books
                .Select(p => p.Category)
                .Distinct()
                .ToList();

            return Ok(bookTypes);
        }
    }
}
