import { useState } from 'react'
import Modal from './Modal.jsx'
import Artwork from './Artwork.jsx'

export default function AddSongsDialog({ catalogSongs, playlist, onAdd, onClose }) {
  const [query, setQuery] = useState('')
  const [feedback, setFeedback] = useState('')
  const [pendingSongId, setPendingSongId] = useState(null)
  async function add(song) {
    if (pendingSongId !== null) return
    setPendingSongId(song.id)
    setFeedback('')
    try {
      await onAdd(song.id, playlist.id)
      setFeedback(`${song.title} added to ${playlist.title}.`)
    } catch (error) {
      setFeedback(`Could not add ${song.title}: ${error.message}`)
    } finally {
      setPendingSongId(null)
    }
  }
  const term = query.trim().toLocaleLowerCase()
  const songs = catalogSongs.filter(song => song.title.toLocaleLowerCase().includes(term) || song.artists.some(artist => artist.name.toLocaleLowerCase().includes(term)))
  return <Modal title={`Add songs to ${playlist.title}`} onClose={onClose} className="add-songs-dialog">
    <label className="field-label" htmlFor="add-songs-search">Search songs</label>
    <input id="add-songs-search" type="search" className="dialog-input" placeholder="Song title or artist" value={query} onChange={event => { setQuery(event.target.value); setFeedback('') }} autoFocus />
    <p className="dialog-status" role="status">{feedback}</p>
    <div className="add-song-list">
      {songs.length ? songs.map(song => {
        const added = playlist.songIds.includes(song.id)
        return <div className="add-song-item" key={song.id}><Artwork id={song.id} label={song.title} /><div className="add-song-info"><strong>{song.title}</strong><span>{song.artists.map(artist => artist.name).join(', ')}</span></div><button type="button" className={added ? 'button-added' : 'button-outline'} disabled={added || pendingSongId !== null} onClick={() => add(song)}>{added ? 'Added' : pendingSongId === song.id ? 'Adding…' : 'Add'}</button></div>
      }) : <p className="section-empty">No songs match your search.</p>}
    </div>
    <div className="dialog-actions"><button type="button" className="button-secondary" onClick={onClose} disabled={pendingSongId !== null}>Done</button></div>
  </Modal>
}
