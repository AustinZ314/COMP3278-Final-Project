import PageLayout from '../components/PageLayout.jsx'
import SongCard from '../components/SongCard.jsx'
import SongRow from '../components/SongRow.jsx'
import CatalogStatus from '../components/CatalogStatus.jsx'

export default function HomePage({ catalog, playlists, onAddSong, likedSongIds, pendingLikeIds, likeStatus, onToggleLike }) {
  const { status, error, songs } = catalog
  const browseSongs = songs.slice(0, 4)
  return <PageLayout eyebrow="Your music, in one place" title="Good to see you" description="Explore the songs in your library.">
    <CatalogStatus status={status} error={error} />
    {status === 'ready' && <>
    <section className="music-section" aria-labelledby="browse-heading"><div className="section-heading"><div><h2 id="browse-heading">Browse Music</h2><p>A selection from the catalog</p></div></div>
      {browseSongs.length ? <div className="music-grid">{browseSongs.map(song => <SongCard key={song.id} song={song} />)}</div> : <p className="section-empty">No songs available yet.</p>}
    </section>
    <section className="music-section" aria-labelledby="all-songs-heading"><div className="section-heading"><div><h2 id="all-songs-heading">All Songs</h2><p>The complete catalog</p></div><span className="result-count">{songs.length} {songs.length === 1 ? 'song' : 'songs'}</span></div>
      {songs.length ? <ol className="song-list">{songs.map((song, index) => <SongRow key={song.id} song={song} index={index} playlists={playlists} onAddSong={onAddSong} isLiked={likedSongIds.has(song.id)} likeStatus={likeStatus} likePending={pendingLikeIds.has(song.id)} onToggleLike={onToggleLike} />)}</ol> : <p className="section-empty">No songs available yet.</p>}
    </section>
    </>}
  </PageLayout>
}
