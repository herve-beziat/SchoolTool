# SchoolTool 
 
Intranet mobile étudiant développé pour **La Plateforme**.  
Permet aux étudiants, enseignants et administrateurs de gérer et consulter les emplois du temps, notes, absences et informations liées aux promotions.
 
---
 
## Stack technique
 
| Couche | Technologie |
|---|---|
| Frontend | React Native (Expo) |
| Backend | PHP CodeIgniter 3 |
| Authentification | CodeIgniter 3 + OAuth2 Google |
| Base de données | MariaDB |
| Conteneurisation | Docker & Docker Compose |
| CI/CD | GitHub Actions |
 
---
 
## Prérequis
 
- [Docker](https://docs.docker.com/get-docker/) 24.x
- [Docker Compose](https://docs.docker.com/compose/) v2.x
- [Git](https://git-scm.com/) 2.x
 
---
 
## Installation et lancement (développement)
 
### 1. Cloner le dépôt
 
```bash
git clone https://github.com/herve-beziat/SchoolTool.git
cd SchoolTool
```
 
### 2. Lancer les services
 
```bash
docker compose up --build
```
 
### 3. Hydrater la base de données (premier lancement uniquement)
 
```bash
MYSQL_PWD=root mysql -h 127.0.0.1 -P 3307 -u root < db/createAuth.sql
MYSQL_PWD=root mysql -h 127.0.0.1 -P 3307 -u root < db/createApi.sql
MYSQL_PWD=root mysql -h 127.0.0.1 -P 3307 -u root < db/hydrateAuth.sql
MYSQL_PWD=root mysql -h 127.0.0.1 -P 3307 -u root < db/hydrateApi.sql
```
 
### 4. Accès rapide
 
| Service | URL |
|---|---|
| Frontend (Expo) | http://localhost:8082 |
| API Backend | http://localhost:8000 |
| Auth Service | http://localhost:8001 |
| Base de données | localhost:3307 |
 
---
 
## Structure du projet
 
```
SchoolTool/
├── front/          # Application mobile React Native (Expo)
├── back/           # API principale CodeIgniter 3
├── auth/           # Service d'authentification CodeIgniter 3
├── db/             # Scripts SQL (création + hydratation)
├── docs/           # Documentation (déploiement, tests)
├── postman/        # Collection et environnement Postman
├── .github/
│   └── workflows/  # Pipelines GitHub Actions
├── docker-compose.yml          # Environnement de développement
├── docker-compose.prod.yml     # Environnement de production
└── .env.prod.example           # Template des variables d'environnement de prod
```
 
---
 
## Tests
 
### Tests unitaires PHP (PHPUnit)
 
```bash
docker compose exec back ./vendor/bin/phpunit --colors=always --testdox
```
 
### Tests unitaires JS (Jest)
 
```bash
cd front && npm test -- --watchAll=false components/__tests__/ThemedComponents.test.tsx
```
 
### Tests API (Postman)
 
Importer les fichiers suivants dans Postman :
 
- `postman/SchoolTool.postman_collection.json`
- `postman/SchoolTool.postman_environment.json`
 
---
 
## Déploiement
 
Voir la procédure complète dans [`docs/deployment.md`](docs/deployment.md).
 
```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```
 
---
 
## Pipeline CI/CD
 
Le pipeline GitHub Actions se déclenche sur chaque push et pull request :
 
```
push / PR → lint → test-back ──┐
                 → test-front ──┴→ build Docker
```
 
| Job | Outil | Description |
|---|---|---|
| `lint` | ESLint | Vérification qualité du code front |
| `test-back` | PHPUnit | Tests unitaires backend |
| `test-front` | Jest | Tests unitaires frontend |
| `build` | Docker Compose | Build des images de production |
 
---
 
## Contribuer
 
Voir [`CONTRIBUTING.md`](CONTRIBUTING.md) pour les conventions de branches et de commits.