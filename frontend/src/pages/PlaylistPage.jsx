import Artwork from '../components/Artwork.jsx'
import SongRow from '../components/SongRow.jsx'
import { catalogSongs } from '../data/mockCatalog.js'

export default function PlaylistPage({ playlist, playlists, owner, onAddSong, onRemoveSong, openDialog, likedSongIds, onToggleLike }) {
  const songs = playlist.songIds.map(id => catalogSongs.find(song => song.id === id)).filter(Boolean)
  const date = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(playlist.creationDate))
  return <div className="playlist-page page-layout">
    <header className="playlist-hero"><Artwork id={playlist.id} label={playlist.title} size="large" /><div className="playlist-hero-text"><p className="eyebrow">Playlist</p><h1>{playlist.title}</h1><p>{owner} · {songs.length} {songs.length === 1 ? 'song' : 'songs'} · Created {date}</p></div></header>
    <div className="playlist-actions"><button type="button" className="button-primary" onClick={() => openDialog('add', playlist.id)}>Add Songs</button><button type="button" className="button-secondary" onClick={() => openDialog('rename', playlist.id)}>Rename</button><button type="button" className="button-secondary" onClick={() => openDialog('delete', playlist.id)}>Delete</button></div>
    {songs.length ? <section className="music-section" aria-labelledby="playlist-songs-heading"><div className="section-heading"><div><h2 id="playlist-songs-heading">Songs</h2><p>In this playlist</p></div><span className="result-count">{songs.length} {songs.length === 1 ? 'song' : 'songs'}</span></div><ol className="song-list">{songs.map((song, index) => <SongRow key={song.id} song={song} index={index} playlists={playlists} onAddSong={onAddSong} onRemoveSong={onRemoveSong} currentPlaylistId={playlist.id} isLiked={likedSongIds.has(song.id)} onToggleLike={onToggleLike} />)}</ol></section> : <div className="playlist-empty"><span aria-hidden="true">♫</span><h2>Your playlist is empty</h2><p>Add songs from the catalog to make it yours.</p><button type="button" className="button-primary" onClick={() => openDialog('add', playlist.id)}>Add Songs</button></div>}
  </div>
}
