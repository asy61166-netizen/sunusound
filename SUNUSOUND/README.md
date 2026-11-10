# SUNUSOUND – La musique qui nous rassemble.
Application web de streaming musical (HTML5 / CSS3 / JavaScript vanilla / localStorage / HTML Audio API).

## Fichiers
- `index.html` : structure (sidebar, 4 pages, lecteur fixe).
- `css/style.css` : charte rose/violet/noir, Poppins, responsive (desktop, tablette, mobile).
- `js/music.js` : catalogue de démonstration (titre, artiste, album, genre, durée, audio, pochette).
- `js/script.js` : navigation, lecteur, recherche, filtres, favoris, playlists, dernières écoutes, sauvegarde localStorage.

## Lancer
Ouvrir `index.html` dans le navigateur, ou utiliser l'extension VS Code « Live Server ».

## Ajouter des chansons / pochettes
1. Placer un `.mp3` libre de droits dans `music/` (ex. Free Music Archive, Pixabay Music, Jamendo).
2. Placer une pochette `.jpg` dans `assets/covers/` (facultatif : sans elle, un dégradé s'affiche).
3. Ajouter une ligne dans `SONGS` de `js/music.js` avec un `id` unique et les bons chemins.

Fichiers attendus pour la démo : `music/mbalax-1.mp3`, `mbalax-2`, `afrobeat-1`, `afrobeat-2`, `rap-galsen-1`, `rap-galsen-2`, `hiphop-1`, `rnb-1`, `pop-1`, `reggae-1` (.mp3).
Les artistes « Démo » sont fictifs : remplacez-les par les vrais crédits de vos fichiers.

## Tester
Lecture/pause, suivant/précédent, barre de progression, volume, répétition, recherche, filtres de genre, ♥ favoris (rechargez la page : ils persistent), création/renommage/suppression de playlist, ajout/retrait de chansons, redimensionnement de la fenêtre (mobile).
Sans fichier audio, un message « Fichier audio introuvable » s'affiche (gestion d'erreur).

## Déployer sur Vercel
1. Pousser le dossier sur GitHub. 2. Sur vercel.com : *Add New → Project* → importer le dépôt.
3. Framework : *Other* (site statique), laisser build/output vides → *Deploy*.
(Ou : `npm i -g vercel` puis `vercel` dans le dossier.)
