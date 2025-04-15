
# BookStore Enterprise API - .NET Docker Practice Project

A company-level ASP.NET Core Web API project for a bookstore with a React frontend. This application is designed to help you practice Docker containerization with a real-world .NET application in an enterprise context.

## Project Overview

- **Backend**: ASP.NET Core 6.0 Web API
- **Database**: SQL Server (configurable to use in-memory for development)
- **Frontend**: React with Tailwind CSS, shadcn/ui components
- **API Documentation**: Swagger/OpenAPI
- **Architecture**: RESTful API with CRUD operations
- **Deployment**: Docker containers with docker-compose

## Features

- Complete CRUD operations for managing books
- Swagger UI for API documentation and testing
- Entity Framework Core for data access
- Database migration support
- Health check endpoints
- Responsive React frontend with modern UI
- Docker configuration for containerization
- Multi-container deployment with docker-compose

## Running the Application Locally

### Prerequisites

- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- [Node.js](https://nodejs.org/) (for the React frontend)
- (Optional) Visual Studio 2022 or Visual Studio Code
- (Optional) SQL Server instance

### Steps to Run Locally

#### Backend API

1. Navigate to the backend project directory:
   ```
   cd src/Backend
   ```

2. Restore dependencies:
   ```
   dotnet restore
   ```

3. Run the application (will use in-memory database by default):
   ```
   dotnet run --project BookStore.API
   ```

4. Open your browser and navigate to:
   - Swagger UI: https://localhost:5001
   - API endpoint: https://localhost:5001/api/books

#### Frontend

1. Navigate to the root project directory and install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

## Docker Deployment

### Basic Docker Commands

1. **Build the Backend Docker image**:
   ```
   cd src/Backend
   docker build -t bookstore-api .
   ```

2. **Run the backend container**:
   ```
   docker run -p 5000:80 -p 5001:443 --name bookstore-container bookstore-api
   ```

3. **Using docker-compose for multi-container deployment**:
   ```
   cd src/Backend
   docker-compose up -d
   ```

   This will start both the API and the SQL Server database in containers, with proper networking and volume configuration.

4. **View running containers**:
   ```
   docker ps
   ```

5. **Check container logs**:
   ```
   docker logs bookstore-api
   ```

6. **Stop and remove containers**:
   ```
   docker-compose down
   ```

### Docker Concepts to Practice

- **Multi-Container Applications**: Using docker-compose to orchestrate multiple containers
- **Persistence**: Using volumes for database data persistence
- **Networking**: Setting up communication between containers
- **Environment Configuration**: Configuring different environments using environment variables
- **Health Checks**: Monitoring the health of your application
- **Optimizing Docker Images**: Reducing image size, using multi-stage builds
- **CI/CD Integration**: Setting up automated builds and deployments

## Database Migrations

The application is configured to auto-apply migrations when running in Docker or production environments. 

To manually create and apply migrations:

1. Install Entity Framework Core tools:
   ```
   dotnet tool install --global dotnet-ef
   ```

2. Create a migration:
   ```
   cd src/Backend/BookStore.API
   dotnet ef migrations add YourMigrationName
   ```

3. Apply migrations:
   ```
   dotnet ef database update
   ```

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
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Microsoft SQL Server in Docker](https://hub.docker.com/_/microsoft-mssql-server)
