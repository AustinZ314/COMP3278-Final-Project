import SongRow from '../components/SongRow.jsx'

export default function LikedSongsPage({ catalogSongs, likedSongIds, pendingLikeIds, likeStatus, onToggleLike, playlists, onAddSong, onFindSongs, user }) {
  // The SQL Like rows have no timestamp, so use the catalog's stable seed order.
  const songs = likeStatus === 'ready' ? catalogSongs.filter(song => likedSongIds.has(song.id)) : []
  return <div className="page-layout liked-page">
    <header className="playlist-hero"><div className="liked-cover" aria-hidden="true">♥</div><div className="playlist-hero-text"><p className="eyebrow">Your collection</p><h1>Liked Songs</h1><p>{user.username} · {likeStatus === 'ready' ? `${songs.length} ${songs.length === 1 ? 'song' : 'songs'}` : 'Liked songs unavailable'}</p></div></header>
    {likeStatus !== 'ready' ? <p className="section-empty liked-status">{likeStatus === 'loading' ? 'Loading liked songs…' : 'Liked songs are unavailable. Use Retry above.'}</p> : songs.length ? <section className="music-section" aria-labelledby="liked-songs-heading"><div className="section-heading"><div><h2 id="liked-songs-heading">Songs you love</h2><p>Saved to Liked Songs</p></div><span className="result-count">{songs.length} {songs.length === 1 ? 'song' : 'songs'}</span></div><ol className="song-list">{songs.map((song, index) => <SongRow key={song.id} song={song} index={index} playlists={playlists} onAddSong={onAddSong} isLiked likeStatus={likeStatus} likePending={pendingLikeIds.has(song.id)} onToggleLike={onToggleLike} />)}</ol></section> : <div className="playlist-empty"><span aria-hidden="true">♡</span><h2>Songs you like will appear here</h2><p>Save songs by tapping the heart icon.</p><button type="button" className="button-primary" onClick={onFindSongs}>Find Songs</button></div>}
  </div>
}
