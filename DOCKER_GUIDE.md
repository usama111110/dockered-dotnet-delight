
# Understanding the .NET Docker Setup

## .NET Project Structure
The BookStore API is built with .NET 6.0, which is a cross-platform framework for building modern web applications. Here's what you need to know:

- `BookStore.API.csproj`: The project file that defines dependencies and configuration
- `Program.cs`: The entry point of the application where all services are configured
- `Controllers/`: Contains API endpoints
- `Models/`: Contains data models (like Book.cs)
- `Data/`: Contains database context and migrations

## Dockerfile Explanation

Let's break down each part of the Dockerfile:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
```
- Uses the official .NET 6.0 SDK image as the base
- `AS build` creates a build stage that we'll use for compiling

```dockerfile
WORKDIR /src
```
- Sets the working directory inside container to /src

```dockerfile
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"
```
- Installs Entity Framework Core CLI tools
- Adds the tools to the PATH so we can use them

```dockerfile
COPY ["BookStore.API/BookStore.API.csproj", "BookStore.API/"]
RUN dotnet restore "BookStore.API/BookStore.API.csproj"
```
- Copies only the project file first
- Restores NuGet packages (like npm install for .NET)
- This step is separated to utilize Docker layer caching

```dockerfile
COPY . .
WORKDIR "/src/BookStore.API"
```
- Copies all source code
- Changes working directory to the API project

```dockerfile
RUN dotnet ef migrations add InitialCreate --output-dir Migrations
```
- Creates database migration scripts
- These will be used to set up the database schema

```dockerfile
RUN dotnet build "BookStore.API.csproj" -c Release -o /app/build
```
- Builds the application in Release mode
- Output goes to /app/build

```dockerfile
FROM build AS publish
RUN dotnet publish "BookStore.API.csproj" -c Release -o /app/publish
```
- Creates a new stage for publishing
- Publishes the application (creates deployment-ready files)

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
```
- Uses the ASP.NET runtime image (smaller than SDK)
- This is our final production image

```dockerfile
WORKDIR /app
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*
```
- Sets up the app directory
- Installs curl for health checks

```dockerfile
COPY --from=publish /app/publish .
EXPOSE 80
EXPOSE 443
```
- Copies the published files from the publish stage
- Exposes HTTP (80) and HTTPS (443) ports

```dockerfile
ENTRYPOINT ["dotnet", "BookStore.API.dll"]
```
- Starts the application when container runs

## Common Docker Commands for .NET

1. **Build the image**:
   ```bash
   docker build -t bookstore-api .
   ```

2. **Run the container**:
   ```bash
   docker run -p 5000:80 -p 5001:443 bookstore-api
   ```

3. **View logs**:
   ```bash
   docker logs bookstore-api
   ```

4. **Stop the container**:
   ```bash
   docker stop bookstore-api
   ```

## Running .NET Project Locally (Without Docker)

1. **Install .NET 6.0 SDK** from https://dotnet.microsoft.com/download/dotnet/6.0

2. **Navigate to project directory**:
   ```bash
   cd src/Backend/BookStore.API
   ```

3. **Restore packages**:
   ```bash
   dotnet restore
   ```

4. **Run the application**:
   ```bash
   dotnet run
   ```
   The API will be available at:
   - http://localhost:5000
   - https://localhost:5001

5. **Build the project**:
   ```bash
   dotnet build
   ```

6. **Create database migrations**:
   ```bash
   dotnet ef migrations add YourMigrationName
   ```

7. **Apply migrations**:
   ```bash
   dotnet ef database update
   ```

## Docker Multi-Stage Build Benefits

The Dockerfile uses multi-stage builds which:
1. Keeps the final image small
2. Separates build dependencies from runtime
3. Improves security by not including build tools in final image
4. Makes builds faster through caching

## Common Issues and Solutions

1. **Port conflicts**:
   - Change the ports in docker run command
   - Example: `docker run -p 5002:80 -p 5003:443 bookstore-api`

2. **Database connection issues**:
   - Ensure SQL Server container is running
   - Check connection string in appsettings.json
   - Verify network connectivity between containers

3. **Certificate errors**:
   - Development certificates are handled automatically
   - For production, proper SSL certificates should be configured

Remember: The project uses docker-compose for orchestrating both the API and database containers. Always refer to docker-compose.yml for the complete setup.

