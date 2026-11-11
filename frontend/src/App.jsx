import { useRef, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import HomePage from './pages/HomePage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import PlaylistPage from './pages/PlaylistPage.jsx'
import LikedSongsPage from './pages/LikedSongsPage.jsx'
import PlaylistFormDialog from './components/PlaylistFormDialog.jsx'
import DeletePlaylistDialog from './components/DeletePlaylistDialog.jsx'
import AddSongsDialog from './components/AddSongsDialog.jsx'
import { demoPlaylists, demoUser } from './data/demoPlaylists.js'
import { catalogSongs } from './data/mockCatalog.js'

export default function App() {
  const [location, setLocation] = useState({ view: 'home', playlistId: null })
  const [playlists, setPlaylists] = useState(demoPlaylists)
  const [dialog, setDialog] = useState(null)
  const [notice, setNotice] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArtistId, setSelectedArtistId] = useState(null)
  const nextId = useRef(Math.max(...demoPlaylists.map(playlist => playlist.id)) + 1)
  const ownPlaylists = playlists.filter(playlist => playlist.userId === demoUser.id)
  const selectedPlaylist = ownPlaylists.find(playlist => playlist.id === location.playlistId)
  const dialogPlaylist = ownPlaylists.find(playlist => playlist.id === dialog?.playlistId)

  function navigate(view, playlistId = null) {
    if (view === 'create') { setDialog({ type: 'create' }); return }
    if (view === 'playlist' && !ownPlaylists.some(playlist => playlist.id === playlistId)) return
    setNotice('')
    setLocation({ view, playlistId })
  }
  function savePlaylist(title) {
    if (dialog.type === 'create') {
      const id = nextId.current++
      setPlaylists(current => [...current, { id, title, userId: demoUser.id, creationDate: new Date().toISOString(), isPublic: true, songIds: [] }])
      setLocation({ view: 'playlist', playlistId: id })
    } else if (dialog.type === 'rename' && dialogPlaylist) {
      setPlaylists(current => current.map(playlist => playlist.id === dialogPlaylist.id ? { ...playlist, title } : playlist))
    }
    setDialog(null)
  }
  function deletePlaylist() {
    if (!dialogPlaylist) return
    setPlaylists(current => current.filter(playlist => playlist.id !== dialogPlaylist.id))
    setDialog(null)
    setLocation({ view: 'home', playlistId: null })
    setNotice('')
  }
  function addSong(songId, playlistId) {
    const playlist = ownPlaylists.find(item => item.id === playlistId)
    const song = catalogSongs.find(item => item.id === songId)
    if (!playlist || !song) return
    if (playlist.songIds.includes(songId)) { setNotice(`${song.title} is already in ${playlist.title}.`); return }
    setPlaylists(current => current.map(item => item.id === playlistId && !item.songIds.includes(songId) ? { ...item, songIds: [...item.songIds, songId] } : item))
    setNotice(`${song.title} added to ${playlist.title}.`)
  }
  function removeSong(playlistId, songId) {
    if (!ownPlaylists.some(item => item.id === playlistId)) return
    setPlaylists(current => current.map(playlist => playlist.id === playlistId && playlist.userId === demoUser.id ? { ...playlist, songIds: playlist.songIds.filter(id => id !== songId) } : playlist))
    setNotice('Song removed from playlist.')
  }

  let page = <HomePage playlists={ownPlaylists} onAddSong={addSong} />
  if (location.view === 'search') page = <SearchPage query={searchQuery} setQuery={setSearchQuery} selectedArtistId={selectedArtistId} setSelectedArtistId={setSelectedArtistId} playlists={ownPlaylists} onAddSong={addSong} />
  if (location.view === 'liked') page = <LikedSongsPage />
  if (location.view === 'playlist' && selectedPlaylist) page = <PlaylistPage playlist={selectedPlaylist} playlists={ownPlaylists} owner={demoUser.username} onAddSong={addSong} onRemoveSong={removeSong} openDialog={(type, playlistId) => setDialog({ type, playlistId })} />

  return <div className="app-shell">
    <Sidebar view={location.view} playlistId={location.playlistId} playlists={ownPlaylists} navigate={navigate} />
    <main className="main-content" id="main-content">
      <header className="topbar"><span className="topbar-label">Spotify Mini</span><span className="demo-user"><span className="user-avatar" aria-hidden="true">A</span>{demoUser.username}<span className="demo-badge">DEMO</span></span></header>
      {notice && <div className="notice" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Dismiss notice">×</button></div>}
      {page}
    </main>
    {(dialog?.type === 'create' || dialog?.type === 'rename' && dialogPlaylist) && <PlaylistFormDialog key={`${dialog.type}-${dialog.playlistId ?? 'new'}`} playlist={dialog.type === 'rename' ? dialogPlaylist : null} onSave={savePlaylist} onClose={() => setDialog(null)} />}
    {dialog?.type === 'delete' && dialogPlaylist && <DeletePlaylistDialog playlist={dialogPlaylist} onDelete={deletePlaylist} onClose={() => setDialog(null)} />}
    {dialog?.type === 'add' && dialogPlaylist && <AddSongsDialog playlist={dialogPlaylist} onAdd={addSong} onClose={() => setDialog(null)} />}
  </div>
}
