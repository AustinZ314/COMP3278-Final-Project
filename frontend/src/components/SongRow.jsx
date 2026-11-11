import { useEffect, useRef, useState } from 'react'
import Artwork from './Artwork.jsx'

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return '—'
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export default function SongRow({ song, index, playlists = [], onAddSong, onRemoveSong, currentPlaylistId, isLiked = false, onToggleLike }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  useEffect(() => {
    if (!menuOpen) return
    function dismiss(event) { if (!menuRef.current?.contains(event.target)) setMenuOpen(false) }
    function escape(event) { if (event.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape) }
  }, [menuOpen])
  const artistNames = song.artists.map(artist => artist.name).join(', ') || 'Unknown artist'
  return <li className="song-row">
    <span className="song-index" aria-hidden="true">{index + 1}</span>
    <Artwork id={song.id} label={song.title} />
    <div className="song-primary"><strong title={song.title}>{song.title}</strong><span title={artistNames}>{artistNames}</span></div>
    <span className="song-album" title={song.albums.map(album => album.title).join(', ')}>{song.albums.map(album => album.title).join(', ') || '—'}</span>
    <div className="song-actions"><button type="button" className={`row-like-button${isLiked ? ' is-liked' : ''}`} onClick={() => onToggleLike(song.id)} aria-label={`${isLiked ? 'Unlike' : 'Like'} ${song.title}`} aria-pressed={isLiked} title={isLiked ? 'Unlike song' : 'Like song'}>{isLiked ? '♥' : '♡'}</button>
      <div className="playlist-menu-anchor" ref={menuRef}><button type="button" className="row-add-button" onClick={() => setMenuOpen(open => !open)} aria-label={`Add ${song.title} to playlist`} aria-expanded={menuOpen} aria-haspopup="true">＋</button>
        {menuOpen && <div className="playlist-menu"><p>Add to playlist</p>{playlists.length ? playlists.map(playlist => { const added = playlist.songIds.includes(song.id); return <button type="button" key={playlist.id} disabled={added} onClick={() => { onAddSong(song.id, playlist.id); setMenuOpen(false) }}>{playlist.title}<span>{added ? 'Added' : '+'}</span></button> }) : <span className="menu-empty">Create a playlist first.</span>}</div>}
      </div>
      {currentPlaylistId != null && <button type="button" className="row-remove-button" onClick={() => onRemoveSong(currentPlaylistId, song.id)} aria-label={`Remove ${song.title} from this playlist`} title="Remove from this playlist">×</button>}
    </div>
    <span className="song-duration">{formatDuration(song.durationSeconds)}</span>
  </li>
}
