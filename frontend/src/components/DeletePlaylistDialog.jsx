import Modal from './Modal.jsx'

export default function DeletePlaylistDialog({ playlist, onDelete, onClose }) {
  return <Modal title="Delete playlist?" onClose={onClose}>
    <p className="dialog-copy">Delete <strong>{playlist.title}</strong>? This cannot be undone. Songs will remain in the catalog.</p>
    <div className="dialog-actions"><button type="button" className="button-secondary" onClick={onClose}>Cancel</button><button type="button" className="button-danger" onClick={onDelete}>Delete playlist</button></div>
  </Modal>
}
