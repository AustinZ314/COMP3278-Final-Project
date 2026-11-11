// Mirrors Playlist and Add rows in insert_sample_data.sql. User 1 is the fixed Demo User.
export const demoUser = { id: 1, username: 'alex_m' }

export const demoPlaylists = [
  { id: 1001, title: 'Late Night Chill', isPublic: true, creationDate: '2026-01-10T21:15:00', userId: 1, songIds: [101, 103, 106] },
  { id: 1002, title: 'Workout Energy', isPublic: true, creationDate: '2026-02-01T08:30:00', userId: 2, songIds: [102, 105] },
  { id: 1003, title: 'Private Favorites', isPublic: false, creationDate: '2026-02-15T14:05:00', userId: 1, songIds: [104] },
  { id: 1004, title: 'Focus & Study', isPublic: true, creationDate: '2026-03-01T11:20:00', userId: 3, songIds: [106, 107] },
]
