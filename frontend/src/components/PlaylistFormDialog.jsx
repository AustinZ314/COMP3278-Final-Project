import { useState } from 'react'
import Modal from './Modal.jsx'

export default function PlaylistFormDialog({ playlist, onSave, onClose }) {
  const [title, setTitle] = useState(playlist?.title ?? '')
  const [error, setError] = useState('')
  const editing = Boolean(playlist)
  function submit(event) {
    event.preventDefault()
    const name = title.trim()
    if (!name) { setError('Enter a playlist name.'); return }
    onSave(name)
  }
  return <Modal title={editing ? 'Rename playlist' : 'Create playlist'} onClose={onClose}>
    <form onSubmit={submit} noValidate>
      <label className="field-label" htmlFor="playlist-name">Playlist name</label>
      <input id="playlist-name" className="dialog-input" value={title} onChange={event => { setTitle(event.target.value); setError('') }} maxLength={100} autoFocus aria-invalid={Boolean(error)} aria-describedby={error ? 'playlist-name-error' : undefined} />
      {error && <p id="playlist-name-error" className="field-error" role="alert">{error}</p>}
      <div className="dialog-actions"><button type="button" className="button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="button-primary">{editing ? 'Save' : 'Create'}</button></div>
    </form>
  </Modal>
}
