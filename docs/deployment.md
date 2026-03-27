# Procédure de déploiement — SchoolTool
 
> **Projet :** SchoolTool — Intranet mobile étudiant (La Plateforme)  
> **Stack :** CodeIgniter 3 / PHP 7.3 · React Native (Expo Web) · MariaDB · Docker
 
---
 
## 1. Prérequis
 
### Serveur cible
 
| Élément | Version minimale |
|---|---|
| Docker | 24.x |
| Docker Compose | v2.x |
| Git | 2.x |
| RAM disponible | ≥ 1 Go |
| Espace disque | ≥ 5 Go |
 
### Accès nécessaires
 
- Accès SSH au serveur de production
- Droits `sudo` ou appartenance au groupe `docker`
- Accès en lecture au dépôt GitHub (`herve-beziat/SchoolTool`)
 
---
 
## 2. Installation
 
### Cloner le dépôt
 
```bash
git clone https://github.com/herve-beziat/SchoolTool.git
cd SchoolTool
```
 
### Configurer les variables d'environnement
 
Copier le template et remplir les valeurs :
 
```bash
cp .env.prod.example .env.prod
nano .env.prod
```
 
Variables obligatoires à modifier :
 
| Variable | Description |
|---|---|
| `MYSQL_ROOT_PASSWORD` | Mot de passe root MariaDB |
| `MYSQL_PASSWORD` | Mot de passe utilisateur MariaDB |
| `LPTF_JWT_KEY` | Clé secrète JWT (min. 32 caractères) |
| `GOOGLE_CLIENT_ID` | Client ID OAuth Google |
 
> Ne jamais committer le fichier `.env.prod` — il est dans le `.gitignore`.
 
---
 
## 3. Déploiement
 
### Build des images
 
```bash
docker compose -f docker-compose.prod.yml build
```
 
### Lancer les services
 
```bash
docker compose -f docker-compose.prod.yml up -d
```
 
### Hydrater la base de données (premier déploiement uniquement)
 
```bash
docker compose -f docker-compose.prod.yml exec mariadb \
  mysql -u root -p$MYSQL_ROOT_PASSWORD < db/createApi.sql
 
docker compose -f docker-compose.prod.yml exec mariadb \
  mysql -u root -p$MYSQL_ROOT_PASSWORD < db/createAuth.sql
 
docker compose -f docker-compose.prod.yml exec mariadb \
  mysql -u root -p$MYSQL_ROOT_PASSWORD < db/hydrateApi.sql
 
docker compose -f docker-compose.prod.yml exec mariadb \
  mysql -u root -p$MYSQL_ROOT_PASSWORD < db/hydrateAuth.sql
```
 
---
 
## 4. Vérifications
 
### Vérifier que les containers tournent
 
```bash
docker ps
```
 
Les 4 containers suivants doivent être en status `Up` :
 
| Container | Image | Port |
|---|---|---|
| `schooltool-front` | nginx:alpine | 80 |
| `schooltool-back` | php:7.3-apache | — |
| `schooltool-auth` | php:7.3-apache | — |
| `schooltool-db` | mariadb | — |
 
### Smoke test
 
- Front accessible : `http://<IP_SERVEUR>`
- API back : `http://<IP_SERVEUR>/api/health` → doit retourner 200
- Logs sans erreur critique :
 
```bash
docker compose -f docker-compose.prod.yml logs --tail=50
```
 
---
 
## 5. Mise à jour (déploiements suivants)
 
```bash
git pull origin main
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```
 
---
 
## 6. Rollback
 
En cas d'échec après une mise à jour :
 
### Revenir au commit précédent
 
```bash
git log --oneline -5        # identifier le commit stable
git checkout <commit_hash>
```
 
### Rebuilder et relancer
 
```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```
 
### En cas de problème BDD
 
Arrêter les services sans supprimer les volumes :
 
```bash
docker compose -f docker-compose.prod.yml down
```
 
> Ne jamais utiliser `docker compose down -v` en prod — cela supprime les volumes et donc les données.