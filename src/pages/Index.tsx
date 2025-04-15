
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import BookModal from "@/components/BookModal";
import { Pencil, Plus, Trash2 } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
  price: number;
}

const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("Checking...");
  const [baseUrl, setBaseUrl] = useState("https://localhost:5001");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const { toast } = useToast();

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/api/books`);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
        setApiStatus("Connected");
        toast({
          title: "Books fetched successfully",
          description: `Retrieved ${data.length} books from the API.`,
        });
      } else {
        console.error("Failed to fetch books:", response.statusText);
        setApiStatus("Error: " + response.statusText);
        toast({
          title: "Error fetching books",
          description: response.statusText,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setApiStatus("Not Connected");
      toast({
        title: "API Connection Error",
        description: "Could not connect to the API. Please check if it's running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a book
  const deleteBook = async (id: number) => {
    try {
      const response = await fetch(`${baseUrl}/api/books/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBooks(books.filter(book => book.id !== id));
        toast({
          title: "Book deleted",
          description: "The book has been deleted successfully.",
        });
      } else {
        toast({
          title: "Error deleting book",
          description: "Failed to delete the book. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the book.",
        variant: "destructive",
      });
    }
  };

  // Check API health
  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) {
        setApiStatus("Connected");
        toast({
          title: "API Connection Successful",
          description: "Connected to the BookStore API.",
        });
      } else {
        setApiStatus("Error: " + response.statusText);
        toast({
          title: "API Connection Error",
          description: response.statusText,
          variant: "destructive",
        });
      }
    } catch (error) {
      setApiStatus("Not Connected");
      toast({
        title: "API Connection Error",
        description: "Could not connect to the API. Please check if it's running.",
        variant: "destructive",
      });
    }
  };

  const handleOpenModal = (book?: Book) => {
    setCurrentBook(book || null);
    setIsModalOpen(true);
  };

  const handleSaveBook = (savedBook: Book) => {
    // If currentBook has an ID, we're updating, otherwise we're adding
    if (currentBook?.id) {
      setBooks(books.map(book => book.id === savedBook.id ? savedBook : book));
    } else {
      setBooks([...books, savedBook]);
    }
    setIsModalOpen(false);
    setCurrentBook(null);
  };

  useEffect(() => {
    checkApiHealth();
    // We don't immediately fetch books to avoid showing errors if API is not running
  }, [baseUrl]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-2 text-center">BookStore Enterprise Management</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        A company-level application for managing books and authors
      </p>

      <div className="mb-8 max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              .NET API Status
              <Badge variant={apiStatus === "Connected" ? "default" : "destructive"}>
                {apiStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Input 
                value={baseUrl} 
                onChange={(e) => setBaseUrl(e.target.value)} 
                placeholder="API URL"
                className="flex-1"
              />
              <Button onClick={checkApiHealth} variant="outline">Test</Button>
            </div>
            <div className="text-sm text-gray-500">
              Make sure your .NET API is running locally or in Docker
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={fetchBooks} className="w-full">
              Load Books from API
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="books" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="books">Book Management</TabsTrigger>
          <TabsTrigger value="view">View Books</TabsTrigger>
          <TabsTrigger value="docs">API Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="books">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Book Inventory
                <Button onClick={() => handleOpenModal()} size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Book
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : books.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.year}</TableCell>
                        <TableCell>{book.genre}</TableCell>
                        <TableCell>${book.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleOpenModal(book)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteBook(book.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <p className="text-lg text-gray-500">No books available</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Click "Load Books from API" to fetch books from your .NET API
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="view">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : books.length > 0 ? (
              books.map((book) => (
                <Card key={book.id}>
                  <CardHeader>
                    <CardTitle>{book.title}</CardTitle>
                    <Badge className="w-fit">{book.genre}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p><span className="font-medium">Author:</span> {book.author}</p>
                    <p><span className="font-medium">Year:</span> {book.year}</p>
                    <p><span className="font-medium">Price:</span> ${book.price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-gray-500">No books loaded</p>
                <p className="text-sm text-gray-400 mt-2">
                  Click "Load Books from API" to fetch books from your .NET API
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Swagger Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Your API includes Swagger documentation accessible at:
              </p>
              <div className="bg-gray-100 p-3 rounded-md">
                <code>{baseUrl}</code>
              </div>
              <p className="mt-4">
                The Swagger UI allows you to explore and test all API endpoints directly.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => window.open(baseUrl, '_blank')}>
                Open Swagger UI
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Badge className="mb-2" variant="outline">GET</Badge>
                  <div className="text-sm"><code>/api/books</code> - Get all books</div>
                </div>
                <div>
                  <Badge className="mb-2" variant="outline">GET</Badge>
                  <div className="text-sm"><code>/api/books/{"{id}"}</code> - Get a book by ID</div>
                </div>
                <div>
                  <Badge className="mb-2" variant="outline">POST</Badge>
                  <div className="text-sm"><code>/api/books</code> - Create a new book</div>
                </div>
                <div>
                  <Badge className="mb-2" variant="outline">PUT</Badge>
                  <div className="text-sm"><code>/api/books/{"{id}"}</code> - Update a book</div>
                </div>
                <div>
                  <Badge className="mb-2" variant="outline">DELETE</Badge>
                  <div className="text-sm"><code>/api/books/{"{id}"}</code> - Delete a book</div>
                </div>
                <div>
                  <Badge className="mb-2" variant="outline">GET</Badge>
                  <div className="text-sm"><code>/api/health</code> - Check API health</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isModalOpen && (
        <BookModal
          book={currentBook}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentBook(null);
          }}
          onSave={handleSaveBook}
          apiUrl={baseUrl}
        />
      )}
    </div>
  );
};

export default Index;
