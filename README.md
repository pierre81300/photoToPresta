# Photo Analyzer avec Mistral AI

## Getting Started

## Fonctionnalités

- Sélection de photos depuis l'appareil de l'utilisateur
- Prévisualisation des photos sélectionnées
- Possibilité de supprimer des photos de la sélection
- Saisie d'un prompt personnalisé pour l'analyse
- Analyse des photos par Mistral AI
- Affichage de la réponse générée

## Prérequis

- Node.js 18.0.0 ou version ultérieure
- Une clé API Mistral AI

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone <url-du-depot>
   cd photo_to_prestation
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez votre clé API Mistral :
   - Renommez le fichier `.env.local.example` en `.env.local`
   - Remplacez `VOTRE_CLE_API_MISTRAL` par votre clé API Mistral

## Démarrage

Pour démarrer l'application en mode développement :

```bash
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Utilisation

1. Cliquez sur le bouton "Sélectionner des photos" pour choisir une ou plusieurs photos depuis votre appareil.
2. Une fois les photos sélectionnées, elles s'afficheront en aperçu.
3. Saisissez votre question ou prompt dans le champ de texte.
4. Cliquez sur "Analyser les photos" pour envoyer votre demande à Mistral AI.
5. Patientez pendant l'analyse.
6. La réponse générée par Mistral AI s'affichera en dessous.

## Déploiement

Pour construire l'application pour la production :

```bash
npm run build
```

Pour démarrer l'application en mode production :

```bash
npm start
```

## Technologies utilisées

- Next.js
- React
- TypeScript
- Tailwind CSS
- Mistral AI API

## Licence

Ce projet est sous licence MIT.
