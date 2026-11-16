import { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import HomePage from './pages/HomePage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import PlaylistPage from './pages/PlaylistPage.jsx'
import LikedSongsPage from './pages/LikedSongsPage.jsx'
import PlaylistFormDialog from './components/PlaylistFormDialog.jsx'
import DeletePlaylistDialog from './components/DeletePlaylistDialog.jsx'
import AddSongsDialog from './components/AddSongsDialog.jsx'
import { demoUser } from './data/demoPlaylists.js'
import { catalogSongs as mockCatalogSongs } from './data/mockCatalog.js'
import { getCatalog } from './api/catalog.js'
import { getUserPlaylists, createPlaylist, renamePlaylist, deletePlaylist as deletePlaylistApi, addPlaylistSong, removePlaylistSong } from './api/playlists.js'
import { getLikedSongIds, likeSong, unlikeSong } from './api/likes.js'

export default function App() {
  const [location, setLocation] = useState({ view: 'home', playlistId: null })
  const [playlists, setPlaylists] = useState([])
  const [playlistStatus, setPlaylistStatus] = useState('loading')
  const [playlistError, setPlaylistError] = useState('')
  const [dialog, setDialog] = useState(null)
  const [notice, setNotice] = useState('')
  const [likedSongIds, setLikedSongIds] = useState(new Set())
  const likedSongIdsRef = useRef(new Set())
  const [likeStatus, setLikeStatus] = useState('loading')
  const [likeError, setLikeError] = useState('')
  const [pendingLikeIds, setPendingLikeIds] = useState(new Set())
  const pendingLikeRef = useRef(new Set())
  const undoRequestRef = useRef(false)
  const [undoPending, setUndoPending] = useState(false)
  const [undo, setUndo] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArtistId, setSelectedArtistId] = useState(null)
  const [catalog, setCatalog] = useState({ status: 'loading', songs: [], artists: [], error: '' })
  useEffect(() => {
    const controller = new AbortController()
    getCatalog({ signal: controller.signal })
      .then(({ songs, artists }) => setCatalog({ status: 'ready', songs, artists, error: '' }))
      .catch(error => {
        if (error.name !== 'AbortError') setCatalog({ status: 'error', songs: [], artists: [], error: error.message })
      })
    return () => controller.abort()
  }, [])
  useEffect(() => {
    const controller = new AbortController()
    getUserPlaylists(demoUser.id, { signal: controller.signal })
      .then(rows => { setPlaylists(rows); setPlaylistStatus('ready'); setPlaylistError('') })
      .catch(error => {
        if (error.name !== 'AbortError') { setPlaylistStatus('error'); setPlaylistError(error.message) }
      })
    return () => controller.abort()
  }, [])
  useEffect(() => {
    const controller = new AbortController()
    getLikedSongIds(demoUser.id, { signal: controller.signal })
      .then(ids => { likedSongIdsRef.current = ids; setLikedSongIds(ids); setLikeStatus('ready'); setLikeError('') })
      .catch(error => {
        if (error.name !== 'AbortError') { setLikeStatus('error'); setLikeError(error.message) }
      })
    return () => controller.abort()
  }, [])
  async function retryLikes() {
    setLikeStatus('loading')
    setLikeError('')
    try {
      const ids = await getLikedSongIds(demoUser.id)
      likedSongIdsRef.current = ids
      setLikedSongIds(ids)
      setLikeStatus('ready')
    } catch (error) {
      setLikeStatus('error')
      setLikeError(error.message)
    }
  }
  function markLikePending(songId, pending) {
    if (pending) pendingLikeRef.current.add(songId)
    else pendingLikeRef.current.delete(songId)
    setPendingLikeIds(current => {
      const next = new Set(current)
      if (pending) next.add(songId)
      else next.delete(songId)
      return next
    })
  }
  function setSongLiked(songId, liked) {
    const latest = new Set(likedSongIdsRef.current)
    if (liked) latest.add(songId)
    else latest.delete(songId)
    likedSongIdsRef.current = latest
    setLikedSongIds(current => {
      const next = new Set(current)
      if (liked) next.add(songId)
      else next.delete(songId)
      return next
    })
  }
  async function reconcileSongLike(songId) {
    const serverIds = await getLikedSongIds(demoUser.id)
    setSongLiked(songId, serverIds.has(songId))
    return serverIds.has(songId)
  }
  async function retryPlaylists() {
    setPlaylistStatus('loading')
    setPlaylistError('')
    try {
      setPlaylists(await getUserPlaylists(demoUser.id))
      setPlaylistStatus('ready')
    } catch (error) {
      setPlaylistStatus('error')
      setPlaylistError(error.message)
    }
  }
  const activeCatalogSongs = catalog.status === 'ready' ? catalog.songs : mockCatalogSongs
  const ownPlaylists = playlists.filter(playlist => playlist.userId === demoUser.id)
  const selectedPlaylist = ownPlaylists.find(playlist => playlist.id === location.playlistId)
  const dialogPlaylist = ownPlaylists.find(playlist => playlist.id === dialog?.playlistId)

  function navigate(view, playlistId = null) {
    if (view === 'create') {
      if (playlistStatus !== 'ready') return
      setDialog({ type: 'create' }); return
    }
    if (view === 'playlist' && !ownPlaylists.some(playlist => playlist.id === playlistId)) return
    setNotice('')
    setUndo(null)
    setLocation({ view, playlistId })
  }
  async function savePlaylist(title) {
    if (dialog.type === 'create') {
      const created = await createPlaylist(demoUser.id, title)
      if (!Number.isInteger(created?.playlist_id)) throw new Error('Playlist was created, but the backend did not return its ID. Reload the page.')
      try {
        const updated = await getUserPlaylists(demoUser.id)
        setPlaylists(updated)
      } catch {
        setPlaylists(current => [...current, {
          id: created.playlist_id, title: created.title, isPublic: created.is_public,
          creationDate: new Date().toISOString(), userId: created.user_id, songIds: [],
        }])
        setNotice('Playlist created, but its details could not be refreshed. Reload to sync.')
      }
      setLocation({ view: 'playlist', playlistId: created.playlist_id })
    } else if (dialog.type === 'rename' && dialogPlaylist) {
      const updated = await renamePlaylist(demoUser.id, dialogPlaylist.id, title)
      setPlaylists(current => current.map(playlist => playlist.id === dialogPlaylist.id ? { ...playlist, title: updated.title } : playlist))
    }
    setDialog(null)
  }
  async function deletePlaylist() {
    if (!dialogPlaylist) return
    await deletePlaylistApi(demoUser.id, dialogPlaylist.id)
    setPlaylists(current => current.filter(playlist => playlist.id !== dialogPlaylist.id))
    setDialog(null)
    setLocation({ view: 'home', playlistId: null })
    setNotice('')
  }
  async function addSong(songId, playlistId) {
    const playlist = ownPlaylists.find(item => item.id === playlistId)
    const song = activeCatalogSongs.find(item => item.id === songId)
    if (!playlist || !song) throw new Error('Playlist or song is unavailable.')
    if (playlist.songIds.includes(songId)) throw new Error(`${song.title} is already in ${playlist.title}.`)
    try {
      await addPlaylistSong(playlistId, songId)
    } catch (error) {
      if (error.status === 409) getUserPlaylists(demoUser.id).then(setPlaylists).catch(() => {})
      setNotice(`Could not add ${song.title}: ${error.message}`)
      throw error
    }
    setPlaylists(current => current.map(item => item.id === playlistId && !item.songIds.includes(songId) ? { ...item, songIds: [...item.songIds, songId] } : item))
    setNotice(`${song.title} added to ${playlist.title}.`)
  }
  async function removeSong(playlistId, songId) {
    if (!ownPlaylists.some(item => item.id === playlistId)) throw new Error('Playlist is unavailable.')
    try {
      await removePlaylistSong(playlistId, songId)
    } catch (error) {
      setNotice(`Could not remove song: ${error.message}`)
      throw error
    }
    setPlaylists(current => current.map(playlist => playlist.id === playlistId && playlist.userId === demoUser.id ? { ...playlist, songIds: playlist.songIds.filter(id => id !== songId) } : playlist))
    setNotice('Song removed from playlist.')
  }

  async function toggleLike(songId) {
    if (likeStatus !== 'ready' || pendingLikeRef.current.has(songId) || !activeCatalogSongs.some(song => song.id === songId)) return
    const wasLiked = likedSongIdsRef.current.has(songId)
    markLikePending(songId, true)
    try {
      if (wasLiked) await unlikeSong(demoUser.id, songId)
      else await likeSong(demoUser.id, songId)
      setSongLiked(songId, !wasLiked)
      setNotice('')
      if (wasLiked && location.view === 'liked') setUndo({ songId })
    } catch (error) {
      if ((!wasLiked && error.status === 409) || (wasLiked && error.status === 404)) {
        try {
          await reconcileSongLike(songId)
          setNotice('Liked Songs was refreshed from the server.')
        } catch (syncError) {
          setNotice(`Could not refresh Liked Songs: ${syncError.message}`)
        }
      } else {
        setNotice(`Could not ${wasLiked ? 'unlike' : 'like'} song: ${error.message}`)
      }
    } finally {
      markLikePending(songId, false)
    }
  }
  async function undoUnlike() {
    if (!undo || undoRequestRef.current || pendingLikeRef.current.has(undo.songId)) return
    const songId = undo.songId
    undoRequestRef.current = true
    setUndoPending(true)
    markLikePending(songId, true)
    try {
      await likeSong(demoUser.id, songId)
      setSongLiked(songId, true)
      setUndo(current => current?.songId === songId ? null : current)
      setNotice('')
    } catch (error) {
      if (error.status === 409) {
        try {
          if (await reconcileSongLike(songId)) {
            setUndo(current => current?.songId === songId ? null : current)
            setNotice('Liked Songs was refreshed from the server.')
          } else setNotice('Could not undo unlike: the song is still not liked.')
        } catch (syncError) {
          setNotice(`Could not refresh Liked Songs: ${syncError.message}`)
        }
      } else setNotice(`Could not undo unlike: ${error.message}`)
    } finally {
      markLikePending(songId, false)
      undoRequestRef.current = false
      setUndoPending(false)
    }
  }

  const likeProps = { likedSongIds, pendingLikeIds, likeStatus, onToggleLike: toggleLike }
  let page = <HomePage catalog={catalog} playlists={ownPlaylists} onAddSong={addSong} {...likeProps} />
  if (location.view === 'search') page = <SearchPage catalog={catalog} query={searchQuery} setQuery={setSearchQuery} selectedArtistId={selectedArtistId} setSelectedArtistId={setSelectedArtistId} playlists={ownPlaylists} onAddSong={addSong} {...likeProps} />
  if (location.view === 'liked') page = <LikedSongsPage catalogSongs={activeCatalogSongs} playlists={ownPlaylists} onAddSong={addSong} onFindSongs={() => navigate('search')} user={demoUser} {...likeProps} />
  if (location.view === 'playlist' && selectedPlaylist) page = <PlaylistPage catalogSongs={activeCatalogSongs} playlist={selectedPlaylist} playlists={ownPlaylists} owner={demoUser.username} onAddSong={addSong} onRemoveSong={removeSong} openDialog={(type, playlistId) => setDialog({ type, playlistId })} {...likeProps} />

  return <div className="app-shell">
    <Sidebar view={location.view} playlistId={location.playlistId} playlists={ownPlaylists} navigate={navigate} />
    <main className="main-content" id="main-content">
      <header className="topbar"><span className="topbar-label">Spotify Mini</span><span className="demo-user"><span className="user-avatar" aria-hidden="true">A</span>{demoUser.username}<span className="demo-badge">DEMO</span></span></header>
      {notice && <div className="notice" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Dismiss notice">×</button></div>}
      {playlistStatus !== 'ready' && <div className={`notice${playlistStatus === 'error' ? ' playlist-load-error' : ''}`} role={playlistStatus === 'error' ? 'alert' : 'status'}><span>{playlistStatus === 'loading' ? 'Loading your playlists…' : `Could not load playlists. ${playlistError}`}</span>{playlistStatus === 'error' && <button type="button" className="playlist-retry" onClick={retryPlaylists}>Retry</button>}</div>}
      {likeStatus !== 'ready' && <div className={`notice${likeStatus === 'error' ? ' playlist-load-error' : ''}`} role={likeStatus === 'error' ? 'alert' : 'status'}><span>{likeStatus === 'loading' ? 'Loading liked songs…' : `Could not load liked songs. ${likeError}`}</span>{likeStatus === 'error' && <button type="button" className="playlist-retry" onClick={retryLikes}>Retry</button>}</div>}
      {location.view === 'liked' && undo && <div className="notice undo-notice" role="status"><span>Removed from Liked Songs.</span><button type="button" className="undo-button" onClick={undoUnlike} disabled={undoPending}>{undoPending ? 'Restoring…' : 'Undo'}</button></div>}
      {page}
    </main>
    {(dialog?.type === 'create' || dialog?.type === 'rename' && dialogPlaylist) && <PlaylistFormDialog key={`${dialog.type}-${dialog.playlistId ?? 'new'}`} playlist={dialog.type === 'rename' ? dialogPlaylist : null} onSave={savePlaylist} onClose={() => setDialog(null)} />}
    {dialog?.type === 'delete' && dialogPlaylist && <DeletePlaylistDialog playlist={dialogPlaylist} onDelete={deletePlaylist} onClose={() => setDialog(null)} />}
    {dialog?.type === 'add' && dialogPlaylist && <AddSongsDialog catalogSongs={activeCatalogSongs} playlist={dialogPlaylist} onAdd={addSong} onClose={() => setDialog(null)} />}
  </div>
}
