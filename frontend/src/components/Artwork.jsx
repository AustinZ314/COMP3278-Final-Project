export default function Artwork({ kind = 'song', id, label, size = 'small' }) {
  return <span className={`artwork artwork-${kind} artwork-${size} artwork-tone-${id % 5}`} role="img" aria-label={`${label} placeholder artwork`}><span aria-hidden="true">{kind === 'artist' ? label.slice(0, 1) : '♫'}</span></span>
}
