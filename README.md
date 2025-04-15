
# BookStore API - .NET Docker Practice Project

This is a simple ASP.NET Core Web API project for a bookstore. It's designed to help you practice Docker containerization with a real-world .NET application.

## Project Overview

- **Technology**: ASP.NET Core 6.0 Web API
- **Database**: In-memory Entity Framework Core (for simplicity)
- **API Documentation**: Swagger/OpenAPI
- **Architecture**: RESTful API with CRUD operations

## Features

- Complete CRUD operations for managing books
- Swagger UI for API documentation and testing
- Entity Framework Core for data access
- Docker configuration for containerization
- Health check endpoint

## Running the Application Locally

### Prerequisites

- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- (Optional) Visual Studio 2022 or Visual Studio Code

### Steps to Run Locally

1. Clone this repository
2. Navigate to the project directory:
   ```
   cd src/Backend
   ```
3. Run the application:
   ```
   dotnet run --project BookStore.API
   ```
4. Open your browser and navigate to:
   - Swagger UI: https://localhost:5001
   - API endpoint: https://localhost:5001/api/books

## Docker Deployment Guidelines

### Basic Docker Commands

1. **Build the Docker image**:
   ```
   cd src/Backend
   docker build -t bookstore-api .
   ```

2. **Run the container**:
   ```
   docker run -p 5000:80 -p 5001:443 --name bookstore-container bookstore-api
   ```

3. **View running containers**:
   ```
   docker ps
   ```

4. **Stop the container**:
   ```
   docker stop bookstore-container
   ```

5. **Using docker-compose**:
   ```
   docker-compose up
   ```

### Docker Concepts to Practice

- **Optimizing Dockerfile** - Try minimizing image size and layers
- **Environment Variables** - Configure different environments
- **Volumes** - For data persistence
- **Networking** - Connect multiple containers
- **Docker Compose** - Manage multi-container deployments
- **Health Checks** - Ensure your container is healthy

## API Endpoints

- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get a book by ID
- `POST /api/books` - Create a new book
- `PUT /api/books/{id}` - Update an existing book
- `DELETE /api/books/{id}` - Delete a book
- `GET /api/health` - Check API health

## Learning Resources

- [Docker Documentation](https://docs.docker.com/)
- [ASP.NET Core Docker Guide](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/docker/building-net-docker-images)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
