
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Install EF Core CLI tools
RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

# Copy csproj and restore dependencies
COPY ["BookStore.API/BookStore.API.csproj", "BookStore.API/"]
RUN dotnet restore "BookStore.API/BookStore.API.csproj"

# Copy all files and build
COPY . .
WORKDIR "/src/BookStore.API"

# Generate EF Core migration bundle
RUN dotnet ef migrations add InitialCreate --output-dir Migrations

# Build the application
RUN dotnet build "BookStore.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "BookStore.API.csproj" -c Release -o /app/publish

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .
EXPOSE 80
EXPOSE 443

# Use shell form to pass environment variables correctly
ENTRYPOINT ["dotnet", "BookStore.API.dll"]
