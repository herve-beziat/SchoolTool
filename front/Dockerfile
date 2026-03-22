FROM node:20

WORKDIR /app

# Copie les manifests d'abord pour maximiser le cache Docker
COPY package.json ./

# Install des dépendances
RUN npm install --legacy-peer-deps

# Installe bun temporairement pour expo install --fix
RUN npm install -g bun
RUN bun install --frozen-lockfile || true

# Installe ngrok globalement pour le tunnel Expo
RUN npm install -g @expo/ngrok@^4.1.0

# Puis le reste du code
COPY . .

EXPOSE 8081
EXPOSE 19000 19001 19002

# Lance Expo directement via node pour éviter le problème de SIGTERM avec npm
CMD ["sh", "-c", "npx expo install --fix --npm && node /app/node_modules/.bin/expo start --tunnel"]