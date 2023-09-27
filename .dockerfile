# Utilisez une image Node.js en tant qu'image de base
FROM node:14

# Créez un répertoire de travail dans l'image Docker
WORKDIR /app

# Copiez les fichiers de votre application dans le répertoire de travail
COPY package*.json ./
COPY . .

# Installez les dépendances de votre application
RUN npm install

# Exposez le port sur lequel votre application écoute (remplacez 3000 par le port approprié)
EXPOSE 3000

# Commande pour démarrer votre application (remplacez "app.js" par le point d'entrée de votre application)
CMD ["node", "index.js"]
