/* music.js – catalogue de démonstration.
   Chaque chanson : id, titre, artiste, album, genre, durée (texte), fichier audio, pochette.
   ⚠ Les fichiers .mp3 et .jpg ne sont PAS fournis : ajoutez-les dans /music et /assets/covers
   (sans pochette, un dégradé rose/violet s'affiche automatiquement). */
const SONGS = [
  {id:1, title:"Teranga Night",  artist:"Artiste Démo 1", album:"Dakar Vibes",   genre:"Mbalax",     duration:"3:30", src:"music/mbalax-1.mp3",   cover:"assets/covers/mbalax-1.jpg"},
  {id:2, title:"Sabar Fever",    artist:"Artiste Démo 1", album:"Dakar Vibes",   genre:"Mbalax",     duration:"4:02", src:"music/mbalax-2.mp3",   cover:"assets/covers/mbalax-2.jpg"},
  {id:3, title:"Lagos Sunrise",  artist:"Artiste Démo 2", album:"Afro Lights",   genre:"Afrobeat",   duration:"3:15", src:"music/afrobeat-1.mp3", cover:"assets/covers/afrobeat-1.jpg"},
  {id:4, title:"Palmwine Groove",artist:"Artiste Démo 2", album:"Afro Lights",   genre:"Afrobeat",   duration:"3:48", src:"music/afrobeat-2.mp3", cover:"assets/covers/afrobeat-2.jpg"},
  {id:5, title:"Rue de Médina",  artist:"Artiste Démo 3", album:"Galsen Flow",   genre:"Rap Galsen", duration:"2:58", src:"music/rap-galsen-1.mp3",cover:"assets/covers/rap-galsen-1.jpg"},
  {id:6, title:"Ndakaaru Freestyle",artist:"Artiste Démo 3",album:"Galsen Flow", genre:"Rap Galsen", duration:"3:20", src:"music/rap-galsen-2.mp3",cover:"assets/covers/rap-galsen-2.jpg"},
  {id:7, title:"Concrete Dreams",artist:"Artiste Démo 4", album:"Skyline",       genre:"Hip-hop",    duration:"3:05", src:"music/hiphop-1.mp3",   cover:"assets/covers/hiphop-1.jpg"},
  {id:8, title:"Velvet Hours",   artist:"Artiste Démo 5", album:"Midnight Soul", genre:"R&B",        duration:"3:40", src:"music/rnb-1.mp3",      cover:"assets/covers/rnb-1.jpg"},
  {id:9, title:"Neon Summer",    artist:"Artiste Démo 6", album:"Pop Machine",   genre:"Pop",        duration:"3:12", src:"music/pop-1.mp3",      cover:"assets/covers/pop-1.jpg"},
  {id:10,title:"Island Breeze",  artist:"Artiste Démo 7", album:"Roots Road",    genre:"Reggae",     duration:"4:10", src:"music/reggae-1.mp3",   cover:"assets/covers/reggae-1.jpg"}
];
const GENRES = ["Tous","Mbalax","Afrobeat","Rap Galsen","Hip-hop","R&B","Pop","Reggae"];
