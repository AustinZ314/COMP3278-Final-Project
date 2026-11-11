// Mirrors insert_sample_data.sql. Artwork is generated in CSS; the SQL has no image URL columns.
export const artists = [
  { id: 1, name: 'The Midnight Echo', bio: 'Indie rock band formed in Brooklyn with atmospheric guitar sounds.', country: 'USA' },
  { id: 2, name: 'Aria Vance', bio: 'Chart-topping pop and R&B singer-songwriter.', country: 'UK' },
  { id: 3, name: 'Luna Protocol', bio: 'Electronic music duo specializing in synthwave and ambient beats.', country: 'Canada' },
  { id: 4, name: 'Quantum Echo', bio: 'Experimental progressive metal unit blending jazz fusion.', country: 'Australia' },
]

export const songs = [
  { id: 101, title: 'Neon Reverie', durationSeconds: 215, releaseDate: '2024-01-15' },
  { id: 102, title: 'Starlight Pulse', durationSeconds: 198, releaseDate: '2024-01-15' },
  { id: 103, title: 'Midnight Highway', durationSeconds: 240, releaseDate: '2023-11-03' },
  { id: 104, title: 'Velvet Horizon', durationSeconds: 205, releaseDate: '2025-02-14' },
  { id: 105, title: 'Electric Heartbeat', durationSeconds: 182, releaseDate: '2025-02-14' },
  { id: 106, title: 'Cyber City Lights', durationSeconds: 310, releaseDate: '2023-08-20' },
  { id: 107, title: 'Solar Drift', durationSeconds: 275, releaseDate: '2023-08-20' },
]

export const albums = [
  { id: 10, title: 'Echoes in the Dark', releaseDate: '2024-01-15', artistId: 1 },
  { id: 11, title: 'Velvet', releaseDate: '2025-02-14', artistId: 2 },
  { id: 12, title: 'Synthetic Dreams', releaseDate: '2023-08-20', artistId: 3 },
]

export const contributions = [
  { artistId: 1, songId: 101, role: 'Primary Artist' },
  { artistId: 1, songId: 102, role: 'Primary Artist' },
  { artistId: 1, songId: 103, role: 'Primary Artist' },
  { artistId: 2, songId: 104, role: 'Primary Artist' },
  { artistId: 2, songId: 105, role: 'Primary Artist' },
  { artistId: 3, songId: 106, role: 'Primary Artist' },
  { artistId: 3, songId: 107, role: 'Primary Artist' },
  { artistId: 2, songId: 101, role: 'Featured Artist' },
]

export const albumTracks = [
  { albumId: 10, songId: 101, trackNumber: 1 },
  { albumId: 10, songId: 102, trackNumber: 2 },
  { albumId: 10, songId: 103, trackNumber: 3 },
  { albumId: 11, songId: 104, trackNumber: 1 },
  { albumId: 11, songId: 105, trackNumber: 2 },
  { albumId: 12, songId: 106, trackNumber: 1 },
  { albumId: 12, songId: 107, trackNumber: 2 },
]

export function getCatalogSongs({ songRows = songs, artistRows = artists, albumRows = albums, contributionRows = contributions, trackRows = albumTracks } = {}) {
  const artistById = new Map(artistRows.map(artist => [artist.id, artist]))
  const albumById = new Map(albumRows.map(album => [album.id, album]))
  return songRows.map(song => ({
    ...song,
    artists: contributionRows.filter(row => row.songId === song.id).map(row => artistById.get(row.artistId)).filter(Boolean),
    albums: trackRows.filter(row => row.songId === song.id).map(row => albumById.get(row.albumId)).filter(Boolean),
  }))
}

export const catalogSongs = getCatalogSongs()
export const browseSongs = catalogSongs.slice(0, 4) // Editorial selection for layout only; no ranking.

export function searchCatalog(query, artistId = null, catalog = catalogSongs, artistRows = artists) {
  const term = query.trim().toLocaleLowerCase()
  return {
    artists: artistRows.filter(artist => artist.name.toLocaleLowerCase().includes(term)),
    songs: catalog.filter(song =>
      (artistId === null || song.artists.some(artist => artist.id === artistId)) &&
      (song.title.toLocaleLowerCase().includes(term) || song.artists.some(artist => artist.name.toLocaleLowerCase().includes(term)))
    ),
  }
}
