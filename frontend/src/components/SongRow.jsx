import { useEffect, useRef, useState } from 'react'
import Artwork from './Artwork.jsx'

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return '—'
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export default function SongRow({ song, index, playlists = [], onAddSong, onRemoveSong, currentPlaylistId, isLiked = false, likeStatus = 'ready', likePending = false, onToggleLike }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [pendingPlaylistId, setPendingPlaylistId] = useState(null)
  const [removing, setRemoving] = useState(false)
  const [menuError, setMenuError] = useState('')
  const menuRef = useRef(null)
  async function addToPlaylist(playlistId) {
    if (pendingPlaylistId !== null) return
    setPendingPlaylistId(playlistId)
    setMenuError('')
    try {
      await onAddSong(song.id, playlistId)
      setMenuOpen(false)
    } catch (error) {
      setMenuError(error.message)
    } finally {
      setPendingPlaylistId(null)
    }
  }
  async function removeFromPlaylist() {
    if (removing) return
    setRemoving(true)
    try { await onRemoveSong(currentPlaylistId, song.id) }
    catch { /* App displays the request error. */ }
    finally { setRemoving(false) }
  }
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
    <div className="song-actions"><button type="button" className={`row-like-button${isLiked ? ' is-liked' : ''}`} onClick={() => onToggleLike(song.id)} disabled={likeStatus !== 'ready' || likePending} aria-label={likeStatus !== 'ready' ? `Like status unavailable for ${song.title}` : `${isLiked ? 'Unlike' : 'Like'} ${song.title}`} aria-pressed={likeStatus === 'ready' ? isLiked : undefined} title={likeStatus !== 'ready' ? 'Liked songs are loading or unavailable' : isLiked ? 'Unlike song' : 'Like song'}>{likeStatus !== 'ready' || likePending ? '…' : isLiked ? '♥' : '♡'}</button>
      <div className="playlist-menu-anchor" ref={menuRef}><button type="button" className="row-add-button" onClick={() => { setMenuError(''); setMenuOpen(open => !open) }} aria-label={`Add ${song.title} to playlist`} aria-expanded={menuOpen} aria-haspopup="true">＋</button>
        {menuOpen && <div className="playlist-menu"><p>Add to playlist</p>{playlists.length ? playlists.map(playlist => { const added = playlist.songIds.includes(song.id); return <button type="button" key={playlist.id} disabled={added || pendingPlaylistId !== null} onClick={() => addToPlaylist(playlist.id)}>{playlist.title}<span>{added ? 'Added' : pendingPlaylistId === playlist.id ? 'Adding…' : '+'}</span></button> }) : <span className="menu-empty">Create a playlist first.</span>}{menuError && <span className="menu-error" role="alert">{menuError}</span>}</div>}
      </div>
      {currentPlaylistId != null && <button type="button" className="row-remove-button" onClick={removeFromPlaylist} disabled={removing} aria-label={`Remove ${song.title} from this playlist`} title="Remove from this playlist">{removing ? '…' : '×'}</button>}
    </div>
    <span className="song-duration">{formatDuration(song.durationSeconds)}</span>
  </li>
}
