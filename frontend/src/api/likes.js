import { api } from './client.js'

export function normalizeLikedSongIds(rows) {
  if (!Array.isArray(rows)) throw new Error('Invalid liked songs response.')
  const ids = new Set()
  for (const row of rows) {
    if (!row || !Number.isInteger(row.song_id) || row.song_id <= 0 || ids.has(row.song_id)) {
      throw new Error('Invalid liked songs response.')
    }
    ids.add(row.song_id)
  }
  return ids
}

export function getLikedSongIds(userId, options) {
  return api.get(`/api/users/${userId}/likes`, options).then(normalizeLikedSongIds)
}

export function likeSong(userId, songId) {
  return api.post(`/api/users/${userId}/likes`, { song_id: songId })
}

export function unlikeSong(userId, songId) {
  return api.delete(`/api/users/${userId}/likes/${songId}`)
}
