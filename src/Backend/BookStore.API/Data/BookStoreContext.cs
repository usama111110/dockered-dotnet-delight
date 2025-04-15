
using BookStore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStore.API.Data
{
    public class BookStoreContext : DbContext
    {
        public BookStoreContext(DbContextOptions<BookStoreContext> options)
            : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed initial data
            modelBuilder.Entity<Book>().HasData(
                new Book
                {
                    Id = 1,
                    Title = "Clean Code",
                    Author = "Robert C. Martin",
                    Year = 2008,
                    Genre = "Programming",
                    Price = 39.99m
                },
                new Book
                {
                    Id = 2,
                    Title = "The Pragmatic Programmer",
                    Author = "Andrew Hunt, David Thomas",
                    Year = 1999,
                    Genre = "Programming",
                    Price = 44.99m
                },
                new Book
                {
                    Id = 3,
                    Title = "Design Patterns",
                    Author = "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
                    Year = 1994,
                    Genre = "Programming",
                    Price = 49.99m
                }
            );
        }
    }
}
