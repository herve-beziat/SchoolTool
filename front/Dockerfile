# ── STAGE BUILD ──────────────────────────────────────────────────────────────
FROM node:20 AS build

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx expo export -p web

# ── STAGE PROD ───────────────────────────────────────────────────────────────
FROM nginx:alpine AS prod

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80