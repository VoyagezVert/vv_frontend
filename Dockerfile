# Dockerfile pour React/Vite sans Nginx
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (dev et prod pour le build)
RUN npm ci

# Copier le code source
COPY . .

# Construire l'application
RUN npm run build

# Exposer le port 4173 (port par défaut de vite preview)
EXPOSE 4173

# Utiliser vite preview pour servir l'application buildée
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
