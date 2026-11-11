/* music.js – catalogue SUNUSOUND.
   Chaque chanson : id, titre, artiste, album, genre, durée, audio (src), pochette (cover),
   sn = true si elle apparaît dans « Musiques sénégalaises ».
   Morceaux 1 à 4 : vos fichiers ; morceaux 5 à 14 : démos générées par synthèse (libres de droits).
   Pour ajouter une chanson : .mp3 dans /music, pochette dans /assets/covers, puis une ligne ici. */
const SONGS = [
  {id:1, title:"Dakar Sabar", artist:"u_98673jp944", album:"Dakar Sabar", genre:"Mbalax", duration:"2:13", src:"music/dakar-sabar.mp3", cover:"assets/covers/dakar-sabar.jpg", sn:true},
  {id:2, title:"Senegal Travel Vlog", artist:"Bounce Bay Records", album:"Senegal Travel Vlog", genre:"Afrobeat", duration:"2:03", src:"music/senegal-travel-vlog.mp3", cover:"assets/covers/senegal-travel-vlog.jpg", sn:true},
  {id:3, title:"Atlas Senegal", artist:"Vadim Makes Sound", album:"Atlas Senegal", genre:"Afrobeat", duration:"3:14", src:"music/atlas-senegal.mp3", cover:"assets/covers/atlas-senegal.jpg", sn:true},
  {id:4, title:"Turkish", artist:"Sub Clair", album:"Turkish", genre:"Pop", duration:"2:48", src:"music/turkish.mp3", cover:"assets/covers/turkish.jpg", sn:false},
  {id:5, title:"Teranga Night", artist:"Artiste Démo 1", album:"Dakar Vibes", genre:"Mbalax", duration:"0:35", src:"music/mbalax-1.mp3", cover:"assets/covers/mbalax-1.jpg", sn:true},
  {id:6, title:"Sabar Fever", artist:"Artiste Démo 1", album:"Dakar Vibes", genre:"Mbalax", duration:"0:33", src:"music/mbalax-2.mp3", cover:"assets/covers/mbalax-2.jpg", sn:true},
  {id:7, title:"Lagos Sunrise", artist:"Artiste Démo 2", album:"Afro Lights", genre:"Afrobeat", duration:"0:37", src:"music/afrobeat-1.mp3", cover:"assets/covers/afrobeat-1.jpg", sn:false},
  {id:8, title:"Palmwine Groove", artist:"Artiste Démo 2", album:"Afro Lights", genre:"Afrobeat", duration:"0:36", src:"music/afrobeat-2.mp3", cover:"assets/covers/afrobeat-2.jpg", sn:false},
  {id:9, title:"Rue de Médina", artist:"Artiste Démo 3", album:"Galsen Flow", genre:"Rap Galsen", duration:"0:42", src:"music/rap-galsen-1.mp3", cover:"assets/covers/rap-galsen-1.jpg", sn:true},
  {id:10, title:"Ndakaaru Freestyle", artist:"Artiste Démo 3", album:"Galsen Flow", genre:"Rap Galsen", duration:"0:44", src:"music/rap-galsen-2.mp3", cover:"assets/covers/rap-galsen-2.jpg", sn:true},
  {id:11, title:"Concrete Dreams", artist:"Artiste Démo 4", album:"Skyline", genre:"Hip-hop", duration:"0:46", src:"music/hiphop-1.mp3", cover:"assets/covers/hiphop-1.jpg", sn:false},
  {id:12, title:"Velvet Hours", artist:"Artiste Démo 5", album:"Midnight Soul", genre:"R&B", duration:"0:54", src:"music/rnb-1.mp3", cover:"assets/covers/rnb-1.jpg", sn:false},
  {id:13, title:"Neon Summer", artist:"Artiste Démo 6", album:"Pop Machine", genre:"Pop", duration:"0:32", src:"music/pop-1.mp3", cover:"assets/covers/pop-1.jpg", sn:false},
  {id:14, title:"Island Breeze", artist:"Artiste Démo 7", album:"Roots Road", genre:"Reggae", duration:"0:51", src:"music/reggae-1.mp3", cover:"assets/covers/reggae-1.jpg", sn:false}
];
const GENRES = ["Tous","Mbalax","Afrobeat","Rap Galsen","Hip-hop","R&B","Pop","Reggae"];
