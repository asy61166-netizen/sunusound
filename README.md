# SUNUSOUND — La musique qui nous rassemble

Application web de démonstration musicale réalisée en **HTML5, CSS3 et JavaScript vanilla** pour le projet de Licence 3 Chef de Projet Digital.

## 1. Identité du projet

- **Nom :** SUNUSOUND
- **Slogan :** La musique qui nous rassemble.
- **Concept :** une plateforme de découverte musicale mettant en avant les sonorités sénégalaises, africaines et internationales.
- **Palette :** rose `#EC4899`, violet `#8B5CF6`, noir `#0D0B12`, noir secondaire `#17131F`.
- **Typographie :** Poppins (chargée depuis Google Fonts ; une police de remplacement est prévue).

## 2. Fonctionnalités développées

- Navigation entre Accueil, Explorer, Bibliothèque et Playlists.
- Catalogue de démonstration organisé par genres.
- Recherche dynamique par titre, artiste, album ou genre.
- Filtres musicaux : Mbalax, Afrobeat, Rap Galsen, Hip-hop, R&B, Pop et Reggae.
- Lecteur audio HTML5 : lecture/pause, précédent/suivant, progression, volume et répétition.
- Lecture aléatoire.
- Ajout et retrait des favoris.
- Création, renommage et suppression de playlists.
- Ajout et retrait de chansons dans une playlist.
- Historique des écoutes récentes.
- Sauvegarde des favoris, playlists et écoutes avec `localStorage`.
- Interface responsive pour ordinateur, tablette et smartphone.
- Dix pochettes SVG locales et dix boucles instrumentales originales de démonstration au format WAV.

## 3. Structure des fichiers

```text
SUNUSOUND/
├── index.html
├── vercel.json
├── README.md
├── .gitignore
├── css/
│   └── style.css
├── js/
│   ├── music.js
│   └── script.js
├── assets/
│   └── covers/          # 10 pochettes SVG
└── music/               # 10 extraits audio WAV
```

## 4. Lancer le projet en local

### Méthode simple

1. Décompressez `SUNUSOUND.zip`.
2. Ouvrez le dossier `SUNUSOUND` dans Visual Studio Code.
3. Installez l'extension **Live Server** si elle n'est pas déjà installée.
4. Faites un clic droit sur `index.html` puis choisissez **Open with Live Server**.
5. Le navigateur ouvre l'application. Les fichiers audio et les pochettes sont déjà dans le projet.

Vous pouvez aussi ouvrir directement `index.html` dans un navigateur moderne. Live Server reste préférable pour les tests.

## 5. Ajouter vos propres chansons

1. Placez le fichier audio dans le dossier `music/` (MP3, WAV ou OGG pris en charge par le navigateur).
2. Placez la pochette dans `assets/covers/`.
3. Ajoutez une entrée dans le tableau `SONGS` de `js/music.js` :

```js
{
  id: 11,
  title: 'Titre de la chanson',
  artist: 'Nom de l’artiste',
  album: 'Nom de l’album',
  genre: 'Mbalax',
  src: 'music/mon-fichier.mp3',
  cover: 'assets/covers/ma-pochette.jpg',
  duration: '3:25'
}
```

Les morceaux et artistes actuellement fournis sont des contenus de démonstration fictifs. Les dix boucles WAV ont été créées spécialement pour tester le lecteur ; elles ne représentent pas des chansons commerciales ni des enregistrements d'artistes sénégalais.

## 6. Tests fonctionnels à réaliser

- [ ] Les quatre boutons de navigation ouvrent la bonne page.
- [ ] La recherche trouve un titre, un artiste et un genre ; une recherche sans résultat affiche un message.
- [ ] Les filtres de genres affichent les bons morceaux.
- [ ] Une chanson démarre avec le bouton de lecture.
- [ ] Lecture/pause, suivant, précédent et répétition fonctionnent.
- [ ] La barre de progression et le volume fonctionnent.
- [ ] Lecture aléatoire activable/désactivable.
- [ ] Un favori reste enregistré après actualisation.
- [ ] Création, renommage et suppression d'une playlist fonctionnent.
- [ ] Ajout et retrait d'un morceau d'une playlist fonctionnent.
- [ ] Les écoutes récentes s'affichent dans la bibliothèque.
- [ ] Aucun message d'erreur n'apparaît dans la console du navigateur.
- [ ] L'affichage reste lisible à 1440 px, 768 px et 390 px de largeur.

Pour ouvrir la console : `F12` ou `Ctrl + Shift + J` dans Chrome/Edge.

## 7. Déploiement sur Vercel

Le projet est un site statique : aucun serveur ni commande de compilation n'est nécessaire.

1. Créez un dépôt GitHub et envoyez-y le contenu du dossier `SUNUSOUND`.
2. Connectez-vous à Vercel avec votre compte.
3. Choisissez **Add New → Project**, puis importez le dépôt GitHub.
4. Framework Preset : **Other**.
5. Build Command : laissez vide.
6. Output Directory : laissez vide (racine du projet).
7. Cliquez sur **Deploy**.
8. À la fin du déploiement, copiez l'adresse publique fournie par Vercel et testez-la sur ordinateur et téléphone.

Le fichier `vercel.json` configure le site comme un site statique.

## 8. Remise du travail

Le tableau de remise de l'enseignant demande les éléments suivants :

- Nom du projet : `SUNUSOUND`
- Lien de la maquette Figma : le lien de votre prototype Figma Make.
- Lien de l'application : l'URL publique obtenue après déploiement sur Vercel.

Liens de travail connus :
- Figma : https://www.figma.com/make/fbFbD5PXDZnnbv5Y24GleU/Créer-la-plateforme-SUNUSOUND
- Tableau de remise : https://docs.google.com/spreadsheets/d/1MCBSJjdJHypH0X4mMcy0UoDCkpTxb_emm-m0YOwcWRw/edit?usp=sharing

**Important :** le code est préparé pour le déploiement, mais il faut encore publier le dossier depuis votre compte Vercel, puis reporter l'URL publique dans le tableau de l'enseignant. Vérifiez également que la maquette Figma et l'interface développée correspondent bien écran par écran.

## 9. Technologies

- HTML5 : structure et éléments audio.
- CSS3 : charte graphique et responsive design avec media queries.
- JavaScript ES6 : navigation, événements, recherche, filtres et gestion des playlists.
- Web Storage API : persistance des données via `localStorage`.
- HTML Audio API : lecture des fichiers WAV/MP3/OGG.
