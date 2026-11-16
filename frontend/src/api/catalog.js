import { api } from './client.js'

function validId(value) {
  return Number.isInteger(value) && value > 0
}

export function normalizeArtists(rows) {
  if (!Array.isArray(rows)) throw new Error('Invalid artist catalog response.')
  const ids = new Set()
  return rows.map(artist => {
    if (!artist || !validId(artist.id) || typeof artist.name !== 'string' || !artist.name.trim() || ids.has(artist.id)) {
      throw new Error('Invalid artist catalog response.')
    }
    ids.add(artist.id)
    return { id: artist.id, name: artist.name, bio: artist.bio, country: artist.country }
  })
}

export function normalizeSongs(rows) {
  if (!Array.isArray(rows)) throw new Error('Invalid song catalog response.')
  const ids = new Set()
  return rows.map(song => {
    if (!song || !validId(song.song_id) || ids.has(song.song_id) || typeof song.title !== 'string' ||
        !Number.isInteger(song.duration_seconds) || song.duration_seconds < 0 ||
        typeof song.release_date !== 'string' || !Array.isArray(song.artists) || !Array.isArray(song.albums)) {
      throw new Error('Invalid song catalog response.')
    }
    ids.add(song.song_id)
    const artists = normalizeArtists(song.artists)
    const albums = song.albums.map(album => {
      if (!album || !validId(album.id) || typeof album.title !== 'string') {
        throw new Error('Invalid song catalog response.')
      }
      return { id: album.id, title: album.title, releaseDate: album.releaseDate, artistId: album.artistId }
    })
    return {
      id: song.song_id,
      title: song.title,
      durationSeconds: song.duration_seconds,
      releaseDate: song.release_date,
      artists,
      albums,
    }
  })
}

export async function getCatalog({ signal } = {}) {
  const [songs, artists] = await Promise.all([
    api.get('/api/songs', { signal }),
    api.get('/api/artists', { signal }),
  ])
  return { songs: normalizeSongs(songs), artists: normalizeArtists(artists) }
}
