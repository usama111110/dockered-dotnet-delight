
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/api/books`);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
        setApiStatus("Connected");
      } else {
        console.error("Failed to fetch books:", response.statusText);
        setApiStatus("Error: " + response.statusText);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setApiStatus("Not Connected");
    } finally {
      setIsLoading(false);
    }
  };

  // Check API health
  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) {
        setApiStatus("Connected");
      } else {
        setApiStatus("Error: " + response.statusText);
      }
    } catch (error) {
      setApiStatus("Not Connected");
    }
  };

  useEffect(() => {
    checkApiHealth();
    // We don't immediately fetch books to avoid showing errors if API is not running
  }, [baseUrl]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-2 text-center">BookStore API Practice App</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        A demo front-end for your .NET Docker practice project
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

      <Tabs defaultValue="view" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">View Books</TabsTrigger>
          <TabsTrigger value="docs">API Documentation</TabsTrigger>
        </TabsList>
        <TabsContent value="view">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {isLoading ? (
              <p className="col-span-full text-center py-10">Loading books...</p>
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
    </div>
  );
};

export default Index;
