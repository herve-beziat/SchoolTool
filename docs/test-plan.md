# Plan de tests — SchoolTool

**Projet :** SchoolTool — Intranet mobile étudiant  
**Module :** CDA Module 3 — CP9  
**Date :** Mars 2026  
**Environnement de test :** Docker (PHP 7.3, MariaDB), Node.js 20

---

## Environnements

| Environnement | Description | Config |
|---------------|-------------|--------|
| **DEV** | Développement local | `docker-compose.yml` — volumes montés, ports exposés |
| **TEST** | Exécution des tests | BDD séparée, `.env.test`, jeu d'essai préchargé |
| **PROD** | Production | Image buildée, `restart: always`, ports internes uniquement |

---

## 1. Tests unitaires PHP — PHPUnit

**Outil :** PHPUnit 9.6  
**Composants testés :** `Promotion_Model`, `Calendar_Model`  
**Commande :** `docker compose exec back ./vendor/bin/phpunit --colors=always --testdox`

| # | Fonctionnalité | Type | Outil | Données en entrée | Résultat attendu | Résultat obtenu |
|---|----------------|------|-------|-------------------|------------------|-----------------|
| 1 | POST Promotion | Unitaire | PHPUnit | `promotion_name`, `promotion_year`, `section_id` valides | Retourne un ID (1) | ✅ PASS |
| 2 | POST Promotion | Unitaire | PHPUnit | `promotion_year` manquant | Retourne `false` | ✅ PASS |
| 3 | POST Promotion | Unitaire | PHPUnit | `section_id = 'abc'` (type invalide) | Retourne `false` | ✅ PASS |
| 4 | GET Promotion | Unitaire | PHPUnit | `promotion_name` vide | Retourne un tableau | ✅ PASS |
| 5 | POST Calendar | Unitaire | PHPUnit | `promotion_id`, `name`, `status` valides | Retourne un ID (1) | ✅ PASS |
| 6 | POST Calendar | Unitaire | PHPUnit | `name` manquant | Retourne `false` | ✅ PASS |
| 7 | POST Calendar | Unitaire | PHPUnit | `promotion_id = 'abc'` (type invalide) | Retourne `false` | ✅ PASS |
| 8 | GET Calendar | Unitaire | PHPUnit | `name` vide | Retourne un tableau | ✅ PASS |

---

## 2. Tests unitaires React Native — Jest

**Outil :** Jest  
**Composants testés :** `ThemedText`, `ThemedView`  
**Commande :** `npm test -- --watchAll=false components/__tests__/ThemedComponents.test.tsx`

| # | Fonctionnalité | Type | Outil | Données en entrée | Résultat attendu | Résultat obtenu |
|---|----------------|------|-------|-------------------|------------------|-----------------|
| 9 | ThemedText — rendu texte | Unitaire | Jest | `children = "Bonjour SchoolTool"` | Texte affiché | ✅ PASS |
| 10 | ThemedText — type title | Unitaire | Jest | `type="title"` | Rendu sans erreur | ✅ PASS |
| 11 | ThemedView — rendu enfants | Unitaire | Jest | Enfant `ThemedText` | Contenu affiché | ✅ PASS |

---

## 3. Tests d'intégration API — Postman

**Outil :** Postman  
**Endpoints testés :** `/promotion`, `/student`, `/calendar`  
**Environnement :** `SchoolTool - Local` (`http://localhost:8000`)  
**Auth :** Header `Token: <JWT>`

| # | Fonctionnalité | Type | Outil | Données en entrée | Résultat attendu | Résultat obtenu |
|---|----------------|------|-------|-------------------|------------------|-----------------|
| 12 | GET Promotion | Intégration | Postman | `promotion_name=` + Token valide | 200 + tableau | ✅ PASS |
| 13 | GET Promotion sans token | Sécurité | Postman | Aucun header Token | 402 Denied | ✅ PASS |
| 14 | POST Promotion | Intégration | Postman | `promotion_name`, `promotion_year`, `section_id` | 200 + ID | ✅ PASS |
| 15 | POST Promotion champs manquants | Intégration | Postman | `promotion_name` seul | 412 Precondition Failed | ✅ PASS |
| 16 | GET Student | Intégration | Postman | `student_id=1` + Token valide | 200 + tableau | ✅ PASS |
| 17 | GET Student ID inexistant | Intégration | Postman | `student_id=999999` | 200 + tableau vide | ✅ PASS |
| 18 | GET Calendar | Intégration | Postman | `name=` + Token valide | 200 + tableau | ✅ PASS |
| 19 | POST Calendar | Intégration | Postman | `promotion_id`, `name`, `status` | 200 + ID | ✅ PASS |
| 20 | POST Calendar champs manquants | Intégration | Postman | `name` seul | 412 Precondition Failed | ✅ PASS |

---

## Récapitulatif

| Outil | Tests total | Passés | Échoués |
|-------|-------------|--------|---------|
| PHPUnit | 8 | 8 | 0 |
| Jest | 3 | 3 | 0 |
| Postman | 9 | 9 | 0 |
| **Total** | **20** | **20** | **0** |