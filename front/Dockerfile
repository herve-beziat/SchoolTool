FROM node:18

WORKDIR /app

# Copie les manifests + npmrc d'abord pour maximiser le cache
COPY package.json package-lock.json ./

# Install déterministe (dev deps gardées pour Expo)
RUN npm ci

# Puis le reste du code
COPY . .

EXPOSE 8081
EXPOSE 19000 19001 19002

CMD ["npx", "expo", "start", "--tunnel"]
