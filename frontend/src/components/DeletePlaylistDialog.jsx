import { useState } from 'react'
import Modal from './Modal.jsx'

export default function DeletePlaylistDialog({ playlist, onDelete, onClose }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  async function confirmDelete() {
    if (pending) return
    setPending(true)
    setError('')
    try { await onDelete() }
    catch (failure) { setError(failure.message); setPending(false) }
  }
  return <Modal title="Delete playlist?" onClose={onClose}>
    <p className="dialog-copy">Delete <strong>{playlist.title}</strong>? This cannot be undone. Songs will remain in the catalog.</p>
    {error && <p className="field-error" role="alert">{error}</p>}
    <div className="dialog-actions"><button type="button" className="button-secondary" onClick={onClose} disabled={pending}>Cancel</button><button type="button" className="button-danger" onClick={confirmDelete} disabled={pending}>{pending ? 'Deleting…' : 'Delete playlist'}</button></div>
  </Modal>
}
