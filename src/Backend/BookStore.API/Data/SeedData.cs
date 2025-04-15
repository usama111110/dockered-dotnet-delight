
using BookStore.API.Models;

namespace BookStore.API.Data
{
    public static class SeedData
    {
        public static void Initialize(BookStoreContext context)
        {
            if (context.Books.Any())
            {
                return; // Database has already been seeded
            }

            var books = new[]
            {
                new Book
                {
                    Title = "Domain-Driven Design",
                    Author = "Eric Evans",
                    Year = 2003,
                    Genre = "Software Engineering",
                    Price = 59.99m
                },
                new Book
                {
                    Title = "Clean Code",
                    Author = "Robert C. Martin",
                    Year = 2008,
                    Genre = "Software Engineering",
                    Price = 49.99m
                },
                new Book
                {
                    Title = "The Pragmatic Programmer",
                    Author = "Andrew Hunt, David Thomas",
                    Year = 1999,
                    Genre = "Software Engineering",
                    Price = 39.99m
                },
                new Book
                {
                    Title = "Design Patterns",
                    Author = "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
                    Year = 1994,
                    Genre = "Software Engineering",
                    Price = 54.99m
                },
                new Book
                {
                    Title = "Refactoring",
                    Author = "Martin Fowler",
                    Year = 1999,
                    Genre = "Software Engineering",
                    Price = 44.99m
                }
            };

            context.Books.AddRange(books);
            context.SaveChanges();
        }
    }
}
