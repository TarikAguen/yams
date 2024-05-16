# 🎲 Yummy Yam's 🎲

<p align="center">
  <img src="./pastries/images/brioche-pain-perdu.jpeg" width="80" />
  <img src="./pastries/images/cake-choco.jpeg" width="80" />
  <img src="./pastries/images/eclair.jpeg" width="80" />
  <img src="./pastries/images/banana-split.jpeg" width="80" />
  <img src="./pastries/images/fondant.jpeg" width="80" />
  <img src="./pastries/images/glaces-vanille.jpeg" width="80" />
  <img src="./pastries/images/cake-framboise.jpeg" width="80" />
  <img src="./pastries/images/tarte-poire.jpeg" width="80" />
</p>

## Introduction

Le jeu du Yam's (ou aussi Yahtzee) est un jeu de dés qui se joue seul ou à plusieurs.

Le but du jeu est de réaliser des combinaisons de dés pour gagner des points. Le jeu se joue avec 5 dés et le joueur peut lancer les dés 3 fois à chaque tour.

## Présentation générale du sujet

Le client est un chocolatier qui veut organiser un jeu en ligne pour fidéliser sa clientèle et dans une certaine mesure faire parler de lui et de sa chocolaterie au près d'autres clients potentiels.

Il souhaite donc créer une sorte de **Yam's** où n'importe qui pourrait s'inscrire et jouer pour tenter de gagner des pâtisseries.

Il imagine une page Web unique présentant le jeu avec au préalable une inscription nécessaire pour commencer (afin d'obtenir les informations personnels de ses potentiels futurs clients).

Une fois inscrit et connecté, le joueur pourrait alors lancer 5 dés (jusqu'à 3 tentatives) à l'aide d'un bouton unique. Si l'une de ses tentatives donne lieu à une combinaison gagnante (selon les règles définies plus bas dans ce brief), le joueur pourra alors gagner une pâtisserie mise en jeu par le chocolatier, depuis un espace back-end.

Cet évènement durera tant que toutes les pâtisseries ne seront pas gagnées.

Une fois le jeu terminé (comprendre : _toutes les pâtisseries stockées dans le back-end ont été associées à un gagnant_), on affichera la page des résultats avec les prénoms des gagnants, associés à leur pâtisserie et la date et l'heure de leur victoire.

## Combinaisons gagnantes

Il existe 3 types de combinaisons :

- **YAM'S (5/5 dés identiques 🎲🎲🎲🎲🎲)** : L'utilisateur se verra attribuer immédiatement 3 pâtisseries.

- **CARRÉ (4/5 dés identiques 🎲🎲🎲🎲)** : L'utilisateur se verra attribuer immédiatement 2 pâtisseries.

- **DOUBLE (2 paires de dés identiques 🎲🎲 + 🎲🎲)** : L'utilisateur se verra attribuer immédiatement 1 pâtisserie.

---

## Données fournies

Le chocolatier possède une liste de pâtisseries prédéfinie. Les données sont fournies à côté de ce brief dans le [fichier `pastries.json`](./pastries/pastries.json), et devront être importées dans une base de données MongoDB.

Chaque pâtisserie pourra être associée à un gagnant (donc un utilisateur existant), et une date de victoire.

## Contraintes techniques

- L'architecture du projet doit être Dockerisée (avec un fichier `docker-compose.yml` pour lancer le projet)
- Le back-end doit être écrit en Node.js avec Express, et fonctionner comme une API
- Le front-end doit être écrit en React, avec un state manager (Redux/RTK) pour conserver les informations de l'utilisateur connecté et l'état applicatif tout au long du jeu
- TypeScript doit être utilisé pour au moins le front-end ou le back-end (ou les deux)
- Les données doivent être stockées dans une base de données MongoDB, et manipulées avec Mongoose
- Les appels vers l'API doivent être sécurisés avec un système de token JWT
  - Un utilisateur qui se connecte doit donc recevoir un token JWT qu'il devra renvoyer à chaque requête pour prouver son identité. Ce token doit être stocké dans le local storage du navigateur, et dispose d'une durée de validité de 1h00

## Règles de sécurité

### Niveau applicatif

- Le tirage des dés doit être effectué côté serveur (via un API call) pour éviter toute tentative de triche côté client
- Chaque compte utilisateur ne peut jouer que jusqu'à 3 fois. Après 3 tentatives, le joueur ne pourra plus jouer jusqu'à la fin de l'évènement.

### Niveau développement

- Les mots de passe des utilisateurs doivent être hachés avec une fonction de hachage comme `bcrypt` ou `argon2` avant d'être stockés dans la base de données
- Les tokens JWT doivent être signés avec une clé secrète et vérifiés à chaque requête pour éviter toute tentative de falsification
- Les informations sensibles (identifiants de connexion à la base, clés secrètes, etc.) ne doivent pas être exposées dans le code source et stockés dans un fichier `.env`

---

## Mise en place

Architecture de dossier conseillée :

```
yummy-yams/
├── api/
│   ├── src/
│   │   └── …
│   ├── package.json
│   ├── Dockerfile
│   └── …
├── app/
│   ├── public/
│   ├── src/
│   │   └── …
│   ├── package.json
│   ├── Dockerfile
│   └── …
└── docker-compose.yml
```

Initialisation des projets :

```bash
# Initialiser le front-end :
# ----------
cd yummy-yams
touch Dockerfile
npm create vite@latest app -- --template react-ts

# Initialiser le back-end :
# ----------
cd yummy-yams/api
touch Dockerfile
npm init -y
# Outils et libs essentiels
npm install -D tsx # Si Typescript
npm install express cors mongoose dotenv bcrypt jsonwebtoken
```

Exemple de `docker-compose.yml` de départ :

```yaml
version: "3.9"

services:
  api:
    build: ./api
    ports:
      - 3001:3001
    volumes:
      - ./api:/usr/src/app
    environment:
      - NODE_ENV=development
      - PORT=3001
    depends_on:
      - mongo

  app:
    build: ./app
    ports:
      - 3000:3000
    volumes:
      - ./app:/usr/src/app
    environment:
      - NODE_ENV=development
    depends_on:
      - api

  mongo:
    image: mongo:latest
    ports:
      - 27017:27017
    volumes:
      - ./data:/data/db
```
