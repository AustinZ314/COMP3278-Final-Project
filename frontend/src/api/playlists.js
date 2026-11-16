import { api } from './client.js'

export function normalizePlaylists(rows) {
  if (!Array.isArray(rows)) throw new Error('Invalid playlist response.')
  const ids = new Set()
  return rows.map(row => {
    if (!row || !Number.isInteger(row.playlist_id) || row.playlist_id <= 0 || ids.has(row.playlist_id) ||
        typeof row.title !== 'string' || typeof row.is_public !== 'boolean' ||
        typeof row.creation_date !== 'string' || !Number.isInteger(row.user_id) ||
        !Array.isArray(row.song_ids) || row.song_ids.some(id => !Number.isInteger(id) || id <= 0) ||
        new Set(row.song_ids).size !== row.song_ids.length) {
      throw new Error('Invalid playlist response.')
    }
    ids.add(row.playlist_id)
    return {
      id: row.playlist_id,
      title: row.title,
      isPublic: row.is_public,
      creationDate: row.creation_date,
      userId: row.user_id,
      songIds: row.song_ids,
    }
  })
}

export function getUserPlaylists(userId, options) {
  return api.get(`/api/users/${userId}/playlists`, options).then(normalizePlaylists)
}

export function createPlaylist(userId, title) {
  return api.post(`/api/users/${userId}/playlists`, { title })
}

export function renamePlaylist(userId, playlistId, title) {
  return api.patch(`/api/users/${userId}/playlists/${playlistId}`, { title })
}

export function deletePlaylist(userId, playlistId) {
  return api.delete(`/api/users/${userId}/playlists/${playlistId}`)
}

export function addPlaylistSong(playlistId, songId) {
  return api.post(`/api/playlists/${playlistId}/songs`, { song_id: songId })
}

export function removePlaylistSong(playlistId, songId) {
  return api.delete(`/api/playlists/${playlistId}/songs/${songId}`)
}
