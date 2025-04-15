
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
  price: number;
}

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Book) => void;
  apiUrl: string;
}

const BookModal = ({ book, isOpen, onClose, onSave, apiUrl }: BookModalProps) => {
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [year, setYear] = useState(book?.year?.toString() || "");
  const [genre, setGenre] = useState(book?.genre || "");
  const [price, setPrice] = useState(book?.price?.toString() || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !author || !year || !genre || !price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const bookData = {
      id: book?.id || 0,
      title,
      author,
      year: parseInt(year, 10),
      genre,
      price: parseFloat(price),
    };

    try {
      const url = book?.id 
        ? `${apiUrl}/api/books/${book.id}` 
        : `${apiUrl}/api/books`;
      
      const method = book?.id ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (method === "POST") {
        // If it's a new book, get the ID from the response
        const savedBook = await response.json();
        onSave(savedBook);
      } else {
        // If updating, use our local book data with the existing ID
        onSave(bookData);
      }

      toast({
        title: `Book ${book?.id ? "updated" : "added"} successfully`,
        description: `"${title}" has been ${book?.id ? "updated" : "added"} to the library.`,
      });
    } catch (error) {
      console.error("Error saving book:", error);
      toast({
        title: "Error saving book",
        description: "There was an error saving the book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{book?.id ? "Edit Book" : "Add New Book"}</DialogTitle>
          <DialogDescription>
            {book?.id 
              ? "Update the details of the existing book." 
              : "Fill in the details to add a new book to the library."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Book title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Publication year"
                  min="1000"
                  max={new Date().getFullYear().toString()}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Book genre"
                required
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">
                    {book?.id ? "Updating..." : "Saving..."}
                  </span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                </>
              ) : (
                book?.id ? "Update Book" : "Add Book"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookModal;
