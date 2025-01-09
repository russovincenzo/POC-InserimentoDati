FROM mcr.microsoft.com/dotnet/sdk:8.0 AS cert
RUN dotnet dev-certs https

# Fase 1: Costruzione del frontend React
FROM node:22 AS build-frontend

# Imposta la directory di lavoro per il frontend
WORKDIR /app/frontend

# Copia i file necessari del frontend
COPY frontend/package.json frontend/package-lock.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il frontend nella directory di lavoro
COPY frontend/ .

# Build del frontend React
RUN npm run build

# Fase 2: Costruzione e pubblicazione dell'app .NET
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-backend

# Imposta la directory di lavoro per il backend
WORKDIR /app

# Copia i file necessari del backend
COPY ./*.csproj ./
RUN dotnet restore

# Copia tutto il progetto
COPY . .

# Copia i file buildati del frontend nella cartella wwwroot
COPY --from=build-frontend /app/frontend/build/ ./wwwroot/

# Build del backend
RUN dotnet publish -c Release -o out

# Fase 3: Creazione dell'immagine finale
FROM mcr.microsoft.com/dotnet/aspnet:8.0

# Imposta la directory di lavoro per il runtime
WORKDIR /app

# Copia il risultato della build del backend
COPY --from=build-backend /app/out ./

# Imposta gli URL per HTTP e HTTPS
ENV ASPNETCORE_URLS="http://0.0.0.0:5000;https://0.0.0.0:5001"
ENV ASPNETCORE_ENVIRONMENT=Development

# Espone le porte HTTP e HTTPS
EXPOSE 5000
EXPOSE 5001

COPY --from=cert /root/.dotnet/corefx/cryptography/x509stores/my/* /root/.dotnet/corefx/cryptography/x509stores/my/
# Avvia l'applicazione
ENTRYPOINT ["dotnet", "POC-InserimentoDati.dll"]
