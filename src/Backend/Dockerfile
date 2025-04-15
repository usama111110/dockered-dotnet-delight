
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["BookStore.API/BookStore.API.csproj", "BookStore.API/"]
RUN dotnet restore "BookStore.API/BookStore.API.csproj"

# Copy all files and build
COPY . .
WORKDIR "/src/BookStore.API"
RUN dotnet build "BookStore.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "BookStore.API.csproj" -c Release -o /app/publish

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "BookStore.API.dll"]
