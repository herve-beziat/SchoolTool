# 📘 SchoolTool

## 🚀 Présentation

**SchoolTool** est une application interne développée pour **La Plateforme**.  
Elle permet aux étudiants, enseignants et administrateurs de gérer et consulter :

- Emplois du temps
- Notes et compétences
- Absences et justificatifs
- Informations liées aux promotions et aux étudiants

Le projet repose sur une architecture **multi-services** basée sur **Docker** :

- `front` : application mobile en **React Native (Expo)**
- `back` : API en **PHP CodeIgniter** (gestion des données et règles métier)
- `auth` : service d’**authentification OAuth2 (Google)** en CodeIgniter
- `db` : base de données **MariaDB**

---

## 🛠️ Technologies

- **Frontend** : React Native (Expo, Node 18)
- **Backend & Auth** : PHP CodeIgniter
- **Base de données** : MariaDB
- **Conteneurisation** : Docker & Docker Compose

---

## 📂 Structure du projet

```bash
schooltool/
│── docker-compose.yml
│── front/       # Application mobile (React Native / Expo)
│── back/        # API principale (CodeIgniter)
│── auth/        # Service d’authentification (CodeIgniter)
└── db/          # Base de données (MariaDB via Docker)
---

## ⚙️ Installation & Lancement

### 1️⃣ Prérequis
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

### 2️⃣ Cloner le projet
git clone [https://github.com/alexandre-aloesode/SchoolTool.git]

### 3️⃣ Lancer les services
docker compose up --build

Les conteneurs suivants seront lancés :

db → MariaDB (port 3307)

back → API CodeIgniter (port 8000)

auth → Service Auth CodeIgniter (port 8001)

front → Application mobile Expo (ports 8082, 19000-19002)


### 4️⃣ Accès rapide

Front (Expo) : http://localhost:8082

API (Back) : http://localhost:8000

Auth Service : http://localhost:8001


# Database creation and hydration

<!-- Open a terminal and run the following commands, in order to use the sql files in the folder named "database" -->

MYSQL_PWD=root mysql -h 127.0.0.1 -P 3307 -u root < <path_to_the_database_folder>/createAuth.sql
MYSQL_PWD=root mysql -h 127.0.0.1 -P 3307 -u root < <path_to_the_database_folder>/createApi.sql
MYSQL_PWD=root mysql -h 127.0.0.1 -P 3307 -u root < <path_to_the_database_folder>/hydrateAuth.sql
MYSQL_PWD=root mysql -h 127.0.0.1 -P 3307 -u root < <path_to_the_database_folder>/hydrateApi.sql

# Config files

<!-- In the /front folder, create a file named config.js at the root and add the following -->

export default {
ANDROID_CLIENT_ID: "462034163728-rb6le77tvp0ktpoft8bb5f47tt2qf340.apps.googleusercontent.com",
IOS_CLIENT_ID: "462034163728-o3hjarad42dt0gh5beipmq99q4md2fjv.apps.googleusercontent.com",
WEB_CLIENT_ID:"462034163728-n05qp98g4t5sjjcovkvtmt4vkflveipn.apps.googleusercontent.com",
LPTF_GOOGLE_CLIENT_ID: "604347883543-cu73up3fqo5r9gn18tqpkf3tu9ud41s4.apps.googleusercontent.com",
GOOGLE_CLIENT_SECRET: "ENTER YOUR SECRET HERE",

    LPTF_API_URL:'http://localhost:8000',
    LPTF_AUTH_API_URL :'http://localhost:8001',

}; .

<!-- In the /back and /auth folders, rename the application/config/constants.php.example file into constants.php -->

<!-- docker compose exec front npx expo start --tunnel -->
```
