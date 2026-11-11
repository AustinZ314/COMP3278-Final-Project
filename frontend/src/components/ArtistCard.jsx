import Artwork from './Artwork.jsx'

export default function ArtistCard({ artist, selected, onSelect }) {
  return <button type="button" className={`artist-card${selected ? ' selected' : ''}`} onClick={() => onSelect(artist.id)} aria-pressed={selected}>
    <Artwork kind="artist" size="large" id={artist.id} label={artist.name} />
    <strong>{artist.name}</strong><span>Artist</span>
  </button>
}
