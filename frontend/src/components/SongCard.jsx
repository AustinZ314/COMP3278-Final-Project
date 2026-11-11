import Artwork from './Artwork.jsx'

export default function SongCard({ song }) {
  return <article className="music-card">
    <Artwork kind="song" size="large" id={song.id} label={song.title} />
    <h3 title={song.title}>{song.title}</h3>
    <p title={song.artists.map(artist => artist.name).join(', ')}>{song.artists.map(artist => artist.name).join(', ') || 'Unknown artist'}</p>
  </article>
}
