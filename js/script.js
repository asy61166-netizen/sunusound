/* SUNUSOUND - JavaScript vanilla : navigation, recherche, favoris, playlists et lecteur audio. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const audio = $('#audioElement');
  const safeStore = {
    get(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { toast('Stockage local indisponible sur ce navigateur.'); } }
  };
  let favorites = safeStore.get('sunusound_favorites', []).filter(Number.isFinite);
  let playlists = safeStore.get('sunusound_playlists', []).filter(p => p && Number.isFinite(p.id) && typeof p.name === 'string' && Array.isArray(p.songs));
  let recent = safeStore.get('sunusound_recent', []).filter(Number.isFinite);
  let currentSongId = null;
  let activePage = 'home';
  let activeGenre = 'Tous';
  let searchTerm = '';
  let playQueue = SONGS.map(song => song.id);
  let shuffle = false;
  let repeat = false;
  let toastTimer;

  const songById = id => SONGS.find(song => song.id === Number(id));
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
  const saveData = () => {
    safeStore.set('sunusound_favorites', favorites);
    safeStore.set('sunusound_playlists', playlists);
    safeStore.set('sunusound_recent', recent);
  };
  function toast(message) {
    const element = $('#toast');
    element.textContent = message;
    element.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('show'), 2600);
  }
  const formatTime = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';

  function songCard(song) {
    const isFavorite = favorites.includes(song.id);
    return `<article class="music-card" data-song-card="${song.id}">
      <div class="cover-wrap"><img src="${escapeHTML(song.cover)}" alt="Pochette ${escapeHTML(song.album)}" loading="lazy"><button class="card-heart ${isFavorite ? 'is-favorite' : ''}" data-favorite="${song.id}" aria-label="${isFavorite ? 'Retirer des' : 'Ajouter aux'} favoris">${isFavorite ? '♥' : '♡'}</button><button class="cover-play" data-play-song="${song.id}" aria-label="Écouter ${escapeHTML(song.title)}">▶</button></div>
      <h3>${escapeHTML(song.title)}</h3><p>${escapeHTML(song.artist)} · ${escapeHTML(song.genre)}</p>
    </article>`;
  }
  function renderGrid(element, songs, emptyTitle, emptyText) {
    if (!songs.length) {
      element.innerHTML = `<div class="empty-state"><strong>${escapeHTML(emptyTitle)}</strong>${escapeHTML(emptyText)}</div>`;
      return;
    }
    element.innerHTML = songs.map(songCard).join('');
  }
  function renderHome() {
    renderGrid($('#trendingGrid'), SONGS.slice(0, 5), 'Pas encore de musique', 'Le catalogue sera bientôt disponible.');
    renderGrid($('#senegalGrid'), SONGS.filter(song => ['Mbalax', 'Rap Galsen'].includes(song.genre)).slice(0, 5), 'Aucun titre disponible', 'Ajoutez des chansons au catalogue.');
    $('#genreGrid').innerHTML = GENRES.filter(genre => genre !== 'Tous').map((genre, index) => `<button class="genre-tile" data-select-genre="${escapeHTML(genre)}">${escapeHTML(genre)}<small>${['Rythmes & traditions','Vibes du continent','La scène sénégalaise','Les classiques urbains','Soul & émotions','Énergie pop','Good vibes'][index] || 'À découvrir'}</small></button>`).join('');
  }
  function renderExplore() {
    $('#genreFilters').innerHTML = GENRES.map(genre => `<button class="filter-chip ${activeGenre === genre ? 'active' : ''}" data-genre="${escapeHTML(genre)}">${escapeHTML(genre)}</button>`).join('');
    const matches = SONGS.filter(song => {
      const searchable = `${song.title} ${song.artist} ${song.album} ${song.genre}`.toLocaleLowerCase('fr');
      return (activeGenre === 'Tous' || song.genre === activeGenre) && searchable.includes(searchTerm);
    });
    $('#exploreHeading').textContent = searchTerm ? `Résultats pour « ${searchTerm} »` : activeGenre === 'Tous' ? 'Toutes les chansons' : activeGenre;
    $('#resultCount').textContent = `${matches.length} titre${matches.length > 1 ? 's' : ''} trouvé${matches.length > 1 ? 's' : ''}`;
    renderGrid($('#exploreGrid'), matches, 'Aucun résultat', 'Essayez un autre mot-clé ou une autre catégorie.');
  }
  function renderLibrary() {
    const favoriteSongs = favorites.map(songById).filter(Boolean);
    const recentSongs = recent.map(songById).filter(Boolean);
    $('#libraryStats').innerHTML = `<div class="stat-card"><b>${favoriteSongs.length}</b><span>Morceaux favoris</span></div><div class="stat-card"><b>${playlists.length}</b><span>Playlists créées</span></div><div class="stat-card"><b>${recentSongs.length}</b><span>Écoutes récentes</span></div>`;
    renderGrid($('#favoritesGrid'), favoriteSongs, 'Votre sélection commence ici', 'Touchez le cœur d’un morceau pour le retrouver ici.');
    renderGrid($('#recentGrid'), recentSongs, 'Aucune écoute récente', 'Lancez une chanson pour construire votre historique.');
  }
  function renderPlaylists() {
    const container = $('#playlistList');
    if (!playlists.length) {
      container.innerHTML = '<div class="empty-state"><strong>Aucune playlist pour le moment</strong>Créez votre première playlist et composez votre ambiance musicale.</div>';
      return;
    }
    container.innerHTML = playlists.map(playlist => {
      const songs = playlist.songs.map(songById).filter(Boolean);
      const rows = songs.length ? songs.map(song => `<div class="playlist-song" data-play-song="${song.id}" data-queue="${playlist.id}"><img src="${escapeHTML(song.cover)}" alt=""><div><b>${escapeHTML(song.title)}</b><span>${escapeHTML(song.artist)}</span></div><button class="small-btn danger" data-remove-song="${playlist.id}:${song.id}" aria-label="Retirer ${escapeHTML(song.title)}">Retirer</button></div>`).join('') : '<div class="empty-state">Cette playlist est vide. Ajoutez-y des titres depuis le catalogue.</div>';
      return `<article class="playlist-card"><div class="playlist-head"><div class="playlist-symbol">♫</div><div class="playlist-meta"><h3>${escapeHTML(playlist.name)}</h3><p>${songs.length} morceau${songs.length > 1 ? 'x' : ''}</p></div><button class="small-btn" data-add-song="${playlist.id}">＋ Ajouter</button><button class="small-btn" data-rename-playlist="${playlist.id}">Renommer</button><button class="small-btn danger" data-delete-playlist="${playlist.id}">Supprimer</button></div><div class="playlist-songs">${rows}</div></article>`;
    }).join('');
  }
  function renderAll() { renderHome(); renderExplore(); renderLibrary(); renderPlaylists(); updatePlayer(); }
  function showPage(page) {
    if (!['home', 'explore', 'library', 'playlists'].includes(page)) return;
    activePage = page;
    $$('.page').forEach(section => section.classList.toggle('active', section.id === `page-${page}`));
    $$('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.page === page));
    if (page === 'explore') renderExplore();
    if (page === 'library') renderLibrary();
    if (page === 'playlists') renderPlaylists();
    $('#mainContent').scrollTo({ top: 0, behavior: 'smooth' });
  }
  function setFavorite(id) {
    if (!songById(id)) return;
    favorites = favorites.includes(id) ? favorites.filter(value => value !== id) : [...favorites, id];
    saveData(); renderAll();
    toast(favorites.includes(id) ? 'Ajouté à vos favoris ♥' : 'Retiré de vos favoris');
  }
  function updatePlayer() {
    const song = songById(currentSongId);
    if (!song) return;
    $('#playerTitle').textContent = song.title;
    $('#playerArtist').textContent = song.artist;
    $('#playerCover').src = song.cover;
    $('#playerCover').alt = `Pochette ${song.album}`;
    $('#playerFavorite').textContent = favorites.includes(song.id) ? '♥' : '♡';
    $('#playerFavorite').classList.toggle('active', favorites.includes(song.id));
    $('#playerFavorite').setAttribute('aria-label', favorites.includes(song.id) ? 'Retirer des favoris' : 'Ajouter aux favoris');
    $('#playButton').textContent = audio.paused ? '▶' : 'Ⅱ';
    $('#playButton').setAttribute('aria-label', audio.paused ? 'Lecture' : 'Pause');
    $('#repeatButton').classList.toggle('active', repeat);
    $('#shuffleButton').classList.toggle('active', shuffle);
  }
  function startSong(id, queueIds) {
    const song = songById(id);
    if (!song) return;
    if (Array.isArray(queueIds) && queueIds.length) playQueue = queueIds.map(Number).filter(value => !!songById(value));
    else if (!playQueue.includes(song.id)) playQueue = SONGS.map(item => item.id);
    currentSongId = song.id;
    audio.src = song.src;
    audio.load();
    audio.play().then(() => updatePlayer()).catch(() => {
      updatePlayer();
      toast('Lecture impossible. Vérifiez que le fichier audio est présent.');
    });
    recent = [song.id, ...recent.filter(value => value !== song.id)].slice(0, 12);
    saveData();
    renderLibrary();
    updatePlayer();
  }
  function nextSong(direction = 1) {
    if (!playQueue.length) return;
    if (shuffle && direction > 0 && playQueue.length > 1) {
      const options = playQueue.filter(id => id !== currentSongId);
      startSong(options[Math.floor(Math.random() * options.length)]);
      return;
    }
    let index = playQueue.indexOf(currentSongId);
    if (index < 0) index = 0;
    index = (index + direction + playQueue.length) % playQueue.length;
    startSong(playQueue[index]);
  }
  function addPlaylist() {
    const input = $('#playlistName');
    const name = input.value.trim();
    if (!name) { toast('Saisissez un nom pour votre playlist.'); input.focus(); return; }
    if (playlists.some(item => item.name.toLocaleLowerCase() === name.toLocaleLowerCase())) { toast('Une playlist porte déjà ce nom.'); return; }
    playlists.unshift({ id: Date.now(), name, songs: [] });
    input.value = '';
    saveData(); renderPlaylists(); renderLibrary(); toast('Playlist créée avec succès.');
  }
  function addSongToPlaylist(id) {
    const playlist = playlists.find(item => item.id === Number(id));
    if (!playlist) return;
    const options = SONGS.map(song => `${song.id}. ${song.title} — ${song.artist}`).join('\n');
    const answer = prompt(`Choisissez le numéro du morceau à ajouter :\n\n${options}`, String(SONGS[0].id));
    if (answer === null) return;
    const songId = Number(answer.trim().match(/^\d+/)?.[0]);
    if (!songById(songId)) { toast('Numéro de morceau invalide.'); return; }
    if (playlist.songs.includes(songId)) { toast('Ce morceau est déjà dans la playlist.'); return; }
    playlist.songs.push(songId); saveData(); renderPlaylists(); renderLibrary(); toast('Morceau ajouté à la playlist.');
  }

  // Navigation et actions globales.
  document.addEventListener('click', event => {
    const target = event.target;
    const nav = target.closest('[data-page]');
    if (nav) { showPage(nav.dataset.page); return; }
    const go = target.closest('[data-go]');
    if (go) { if (go.dataset.filter) activeGenre = go.dataset.filter; showPage(go.dataset.go); return; }
    const favorite = target.closest('[data-favorite]');
    if (favorite) { event.stopPropagation(); setFavorite(Number(favorite.dataset.favorite)); return; }
    const genre = target.closest('[data-genre]');
    if (genre) { activeGenre = genre.dataset.genre; renderExplore(); return; }
    const selectGenre = target.closest('[data-select-genre]');
    if (selectGenre) { activeGenre = selectGenre.dataset.selectGenre; showPage('explore'); return; }
    const playButton = target.closest('[data-play-song]');
    if (playButton) {
      const playlistId = playButton.dataset.queue;
      const playlist = playlistId ? playlists.find(item => item.id === Number(playlistId)) : null;
      const parentGrid = playButton.closest('#trendingGrid, #senegalGrid, #exploreGrid, #favoritesGrid, #recentGrid');
      const cards = parentGrid ? $$('[data-play-song]', parentGrid).map(button => Number(button.dataset.playSong)) : null;
      startSong(Number(playButton.dataset.playSong), playlist ? playlist.songs : cards);
      return;
    }
    const remove = target.closest('[data-remove-song]');
    if (remove) {
      const [playlistId, songId] = remove.dataset.removeSong.split(':').map(Number);
      const playlist = playlists.find(item => item.id === playlistId);
      if (playlist) { playlist.songs = playlist.songs.filter(id => id !== songId); saveData(); renderPlaylists(); renderLibrary(); toast('Morceau retiré.'); }
      return;
    }
    const add = target.closest('[data-add-song]'); if (add) { addSongToPlaylist(add.dataset.addSong); return; }
    const rename = target.closest('[data-rename-playlist]');
    if (rename) {
      const playlist = playlists.find(item => item.id === Number(rename.dataset.renamePlaylist));
      if (!playlist) return;
      const name = prompt('Nouveau nom de la playlist :', playlist.name);
      if (name === null || !name.trim()) return;
      if (playlists.some(item => item.id !== playlist.id && item.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase())) { toast('Ce nom est déjà utilisé.'); return; }
      playlist.name = name.trim(); saveData(); renderPlaylists(); toast('Playlist renommée.'); return;
    }
    const removePlaylist = target.closest('[data-delete-playlist]');
    if (removePlaylist) {
      const id = Number(removePlaylist.dataset.deletePlaylist);
      if (confirm('Voulez-vous vraiment supprimer cette playlist ?')) { playlists = playlists.filter(item => item.id !== id); saveData(); renderPlaylists(); renderLibrary(); toast('Playlist supprimée.'); }
    }
  });

  $('#createPlaylistForm').addEventListener('submit', event => { event.preventDefault(); addPlaylist(); });
  $('#searchInput').addEventListener('input', event => {
    searchTerm = event.target.value.trim().toLocaleLowerCase('fr');
    activeGenre = 'Tous';
    showPage('explore');
    renderExplore();
  });
  $('#heroPlay').addEventListener('click', () => startSong(SONGS[0].id, SONGS.map(song => song.id)));
  $('#playButton').addEventListener('click', () => {
    if (!currentSongId) { startSong(SONGS[0].id); return; }
    if (audio.paused) audio.play().catch(() => toast('Impossible de lancer la lecture.'));
    else audio.pause();
  });
  $('#nextButton').addEventListener('click', () => nextSong(1));
  $('#previousButton').addEventListener('click', () => { if (audio.currentTime > 3) audio.currentTime = 0; else nextSong(-1); });
  $('#playerFavorite').addEventListener('click', () => { if (currentSongId) setFavorite(currentSongId); });
  $('#shuffleButton').addEventListener('click', () => { shuffle = !shuffle; updatePlayer(); toast(shuffle ? 'Lecture aléatoire activée.' : 'Lecture aléatoire désactivée.'); });
  $('#repeatButton').addEventListener('click', () => { repeat = !repeat; audio.loop = repeat; updatePlayer(); toast(repeat ? 'Répétition activée.' : 'Répétition désactivée.'); });
  $('#volumeInput').addEventListener('input', event => { audio.volume = Number(event.target.value) / 100; });
  $('#progressInput').addEventListener('input', event => { if (Number.isFinite(audio.duration) && audio.duration > 0) audio.currentTime = (Number(event.target.value) / 100) * audio.duration; });
  $('#queueButton').addEventListener('click', () => {
    const names = playQueue.map((id, index) => `${index + 1}. ${songById(id)?.title || 'Titre inconnu'}`).join('\n');
    alert(`FILE DE LECTURE\n\n${names || 'Aucun morceau'}`);
  });
  audio.addEventListener('play', updatePlayer);
  audio.addEventListener('pause', updatePlayer);
  audio.addEventListener('timeupdate', () => {
    $('#currentTime').textContent = formatTime(audio.currentTime);
    if (Number.isFinite(audio.duration) && audio.duration > 0) $('#progressInput').value = String((audio.currentTime / audio.duration) * 100);
  });
  audio.addEventListener('loadedmetadata', () => { $('#durationTime').textContent = formatTime(audio.duration); });
  audio.addEventListener('ended', () => { if (!repeat) nextSong(1); });
  audio.addEventListener('error', () => { const song = songById(currentSongId); if (song) toast(`Fichier audio introuvable : ${song.src}`); });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); $('#searchInput').focus(); }
    if (event.code === 'Space' && !['INPUT', 'TEXTAREA', 'BUTTON'].includes(document.activeElement.tagName)) { event.preventDefault(); $('#playButton').click(); }
  });

  audio.volume = 0.7;
  renderAll();
  updatePlayer();
})();
