FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.sln .
COPY ShoesMakerWeb/*.csproj ./ShoesMakerWeb/
RUN dotnet restore

# copy everything else and build app
COPY ShoesMakerWeb/. ./ShoesMakerWeb/
WORKDIR /source/ShoesMakerWeb
RUN dotnet publish -c release -o /app 

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:3.1
WORKDIR /app
COPY --from=build /app ./
CMD ASPNETCORE_URLS=http://*:$PORT dotnet ShoesMakerWeb.dll