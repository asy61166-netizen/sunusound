# SUNUSOUND – La musique qui nous rassemble.
Application web de streaming musical : HTML5, CSS3, JavaScript vanilla, localStorage, HTML Audio API.

## Fichiers
- `index.html` : structure (sidebar, 4 pages, lecteur fixe).
- `css/style.css` : charte rose/violet/noir, Poppins, responsive (ordinateur, tablette, mobile).
- `js/music.js` : catalogue (titre, artiste, album, genre, durée, audio, pochette).
- `js/script.js` : navigation, lecteur, recherche, filtres, favoris, playlists, dernières écoutes, localStorage.
- `music/` : vos 4 morceaux (dakar-sabar, senegal-travel-vlog, atlas-senegal, turkish) + 10 démos synthétiques. `assets/covers/` : pochettes ; `assets/images/` : logo et bannière.
- `tools/make_music.py` : script Python qui régénère les morceaux de démo (numpy + ffmpeg).

## Lancer
Ouvrir `index.html` (double-clic) ou, mieux, utiliser « Live Server » dans VS Code. Le son est actif dès le premier clic sur une chanson.

## Ajouter vos chansons
1. Mettre un `.mp3` libre de droits dans `music/` et une pochette `.jpg` dans `assets/covers/` (facultatif).
2. Ajouter une ligne dans `SONGS` de `js/music.js` (id unique, titre, artiste, album, genre, durée, `src`, `cover`).

## Tester
Lecture/pause, précédent/suivant, barre de progression (cliquer pour avancer), volume, répétition, passage automatique à la chanson suivante, recherche, filtres de genre, ♥ favoris (rechargez : ils persistent), playlists (créer, renommer, ajouter, retirer, supprimer), dernières écoutes, redimensionnement (mobile).

## Déployer sur Vercel
1. Pousser le dossier sur GitHub. 2. vercel.com → Add New → Project → importer le dépôt.
3. Framework : Other (site statique), build et output vides → Deploy. (Ou `vercel` en ligne de commande.)
