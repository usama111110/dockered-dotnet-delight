
using System.ComponentModel.DataAnnotations;

namespace BookStore.API.Models
{
    public class Book
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [Required]
        [StringLength(100)]
        public string Author { get; set; }

        public int Year { get; set; }

        [StringLength(50)]
        public string Genre { get; set; }

        [Range(0, 1000)]
        public decimal Price { get; set; }
    }
}
