import PageLayout from '../components/PageLayout.jsx'
import ArtistCard from '../components/ArtistCard.jsx'
import SongRow from '../components/SongRow.jsx'
import { artists, searchCatalog } from '../data/mockCatalog.js'

export default function SearchPage({ query, setQuery, selectedArtistId, setSelectedArtistId, playlists, onAddSong }) {
  const results = searchCatalog(query, selectedArtistId)
  const selectedArtist = artists.find(artist => artist.id === selectedArtistId)
  return <PageLayout eyebrow="Explore the catalog" title="Search" description="Find songs by title or artist name.">
    <div className="search-controls"><label className="search-field"><span aria-hidden="true">⌕</span><input type="search" placeholder="What do you want to find?" value={query} onChange={event => setQuery(event.target.value)} aria-label="Search songs and artists" /></label>
      {selectedArtist && <button type="button" className="filter-chip" onClick={() => setSelectedArtistId(null)} aria-label={`Clear artist filter ${selectedArtist.name}`}>{selectedArtist.name}<span aria-hidden="true">×</span></button>}
    </div>
    <section className="music-section" aria-labelledby="artists-heading"><div className="section-heading"><div><h2 id="artists-heading">Artists</h2><p>Explore the people behind the music</p></div><span className="result-count">{results.artists.length} {results.artists.length === 1 ? 'artist' : 'artists'}</span></div>
      {results.artists.length ? <div className="artist-grid">{results.artists.map(artist => <ArtistCard key={artist.id} artist={artist} selected={selectedArtistId === artist.id} onSelect={setSelectedArtistId} />)}</div> : <p className="section-empty">No artists match your search.</p>}
    </section>
    <section className="music-section" aria-labelledby="song-results-heading"><div className="section-heading"><div><h2 id="song-results-heading">Songs</h2><p>{selectedArtist ? `Songs credited to ${selectedArtist.name}` : 'Songs from the catalog'}</p></div><span className="result-count">{results.songs.length} {results.songs.length === 1 ? 'song' : 'songs'}</span></div>
      {results.songs.length ? <ol className="song-list">{results.songs.map((song, index) => <SongRow key={song.id} song={song} index={index} playlists={playlists} onAddSong={onAddSong} />)}</ol> : <p className="section-empty">No songs match your search{selectedArtist ? ' and artist filter' : ''}.</p>}
    </section>
  </PageLayout>
}
