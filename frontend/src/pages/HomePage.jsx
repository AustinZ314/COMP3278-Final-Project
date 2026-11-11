import PageLayout from '../components/PageLayout.jsx'
import SongCard from '../components/SongCard.jsx'
import SongRow from '../components/SongRow.jsx'
import { browseSongs, catalogSongs } from '../data/mockCatalog.js'

export default function HomePage({ playlists, onAddSong }) {
  return <PageLayout eyebrow="Your music, in one place" title="Good to see you" description="Explore the songs in your library.">
    <section className="music-section" aria-labelledby="browse-heading"><div className="section-heading"><div><h2 id="browse-heading">Browse Music</h2><p>A selection from the catalog</p></div></div>
      {browseSongs.length ? <div className="music-grid">{browseSongs.map(song => <SongCard key={song.id} song={song} />)}</div> : <p className="section-empty">No songs available yet.</p>}
    </section>
    <section className="music-section" aria-labelledby="all-songs-heading"><div className="section-heading"><div><h2 id="all-songs-heading">All Songs</h2><p>The complete catalog</p></div><span className="result-count">{catalogSongs.length} {catalogSongs.length === 1 ? 'song' : 'songs'}</span></div>
      {catalogSongs.length ? <ol className="song-list">{catalogSongs.map((song, index) => <SongRow key={song.id} song={song} index={index} playlists={playlists} onAddSong={onAddSong} />)}</ol> : <p className="section-empty">No songs available yet.</p>}
    </section>
  </PageLayout>
}
