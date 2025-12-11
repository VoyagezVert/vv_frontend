# VoyagezVert Frontend

Application React/TypeScript pour la plateforme VoyagezVert, construite avec Vite et TailwindCSS.

## 📋 Prérequis

- **Node.js** 20.19+ ou 22.12+ (pour le développement local)
- **Docker** et **Docker Compose** (pour la containerisation)
- **npm** ou **yarn**

## 🚀 Démarrage rapide

### Option 1: Avec Docker (Recommandé)

```bash
# Cloner le repository
git clone <repository-url>
cd vv_frontend

# Construire et lancer avec Docker Compose
docker-compose up --build

# Ou en arrière-plan
docker-compose up -d --build

# L'application sera accessible sur http://localhost:4173
```

### Option 2: Développement local

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# L'application sera accessible sur http://localhost:5173
```

## 🛠️ Commandes disponibles

### Développement local
```bash
npm run dev      # Serveur de développement (port 5173)
npm run build    # Construire pour la production
npm run preview  # Prévisualiser le build de production
npm run lint     # Linter le code
```

### Docker
```bash
# Construire l'image
docker build -t vv-frontend .

# Lancer le conteneur
docker run -p 4173:4173 vv-frontend

# Avec Docker Compose
docker-compose up --build     # Construire et lancer
docker-compose up -d         # Lancer en arrière-plan
docker-compose logs -f       # Voir les logs
docker-compose down          # Arrêter les services
```

## 🏗️ Architecture du projet

```
src/
├── components/          # Composants réutilisables
│   ├── layout/         # Composants de mise en page
│   └── ui/            # Composants UI de base
├── pages/              # Pages de l'application
│   ├── Auth/          # Pages d'authentification
│   ├── Dashboard/     # Tableau de bord
│   └── Home/          # Page d'accueil
├── stores/             # État global (Zustand)
├── services/           # Services API
├── hooks/              # Hooks personnalisés
└── types/              # Types TypeScript
```

## 🔧 Technologies utilisées

- **React 19** - Framework frontend
- **TypeScript** - Typage statique
- **Vite** - Build tool et serveur de développement
- **TailwindCSS** - Framework CSS utility-first
- **React Router** - Routing côté client
- **Zustand** - Gestion d'état légère
- **Axios** - Client HTTP

## 🐳 Configuration Docker

Le projet utilise une approche multi-stage avec Node.js pour servir l'application :

- **Image de base** : `node:20-alpine`
- **Port exposé** : `4173`
- **Serveur** : `vite preview` (optimisé pour la production)
- **Support SPA** : Gestion automatique des routes React Router

## ⚙️ Variables d'environnement

Copier `.env.example` vers `.env` et configurer selon vos besoins :

```bash
cp .env.example .env
```

Variables disponibles :
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=VoyagezVert Frontend
VITE_JWT_STORAGE_KEY=vv_auth_token
VITE_DEBUG_MODE=false
```

## 🔐 Authentification

L'application utilise un système d'authentification basé sur JWT avec :
- Store Zustand pour la gestion de l'état
- Persistance locale du token
- Routes protégées avec `ProtectedRoute`
- Redirection automatique vers login

## 🎨 Styling

- **TailwindCSS 3.4** pour les styles utilitaires
- **PostCSS** pour le traitement CSS
- **Configuration personnalisée** dans `tailwind.config.js`
- **Couleurs de marque** définies dans le thème

## 📦 Déploiement

### Production avec Docker
```bash
# Construire pour la production
docker build -t vv-frontend .

# Lancer en production
docker run -d -p 4173:4173 --restart unless-stopped vv-frontend
```

### Build classique
```bash
npm run build
# Les fichiers sont générés dans le dossier `dist/`
```

## 🐛 Développement

### Debugging
- Activer `VITE_DEBUG_MODE=true` dans `.env`
- Utiliser les DevTools React
- Logs disponibles via `docker-compose logs -f`

### Hot Reload
Le mode développement supporte le hot reload automatique :
```bash
npm run dev
# Modifications automatiquement rechargées sur http://localhost:5173
```
