const icons = { home: '⌂', search: '⌕', liked: '♥', add: '+' }

function NavItem({ icon, children, active, onClick }) {
  return <button type="button" className={`nav-item${active ? ' active' : ''}`} onClick={onClick} aria-current={active ? 'page' : undefined}>
    <span className="nav-icon" aria-hidden="true">{icons[icon]}</span><span>{children}</span>
  </button>
}

export default function Sidebar({ view, playlistId, playlists, navigate }) {
  return <aside className="sidebar" aria-label="Application navigation">
    <div className="brand"><span className="brand-mark" aria-hidden="true">≋</span><span>Spotify <b>Mini</b></span></div>
    <nav className="primary-nav" aria-label="Main">
      <NavItem icon="home" active={view === 'home'} onClick={() => navigate('home')}>Home</NavItem>
      <NavItem icon="search" active={view === 'search'} onClick={() => navigate('search')}>Search</NavItem>
      <NavItem icon="liked" active={view === 'liked'} onClick={() => navigate('liked')}>Liked Songs</NavItem>
    </nav>
    <div className="library-section">
      <div className="library-heading"><span className="nav-icon" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg></span><span>Your Library</span></div>
      <button type="button" className="create-playlist" onClick={() => navigate('create')}><span className="create-icon" aria-hidden="true">{icons.add}</span>Create Playlist</button>
      <div className="sidebar-divider" />
      <p className="sidebar-label">PLAYLISTS</p>
      <nav className="playlist-nav" aria-label="Your playlists">
        {playlists.map(playlist => <button key={playlist.id} type="button" className={`playlist-link${view === 'playlist' && playlistId === playlist.id ? ' active' : ''}`} onClick={() => navigate('playlist', playlist.id)} aria-current={view === 'playlist' && playlistId === playlist.id ? 'page' : undefined}><span className="playlist-mini-art" aria-hidden="true">♫</span><span>{playlist.title}</span></button>)}
      </nav>
    </div>
    <div className="sidebar-footer">COMP3278 · Demo experience</div>
  </aside>
}
