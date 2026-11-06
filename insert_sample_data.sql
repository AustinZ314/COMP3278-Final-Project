USE music_streaming_db;

-- 1. Independent Parent Tables
INSERT INTO User (user_id, username, password_hash, email, birth_date, country) VALUES
(1, 'alex_m', 'hash_pw_123456', 'alex.m@example.com', '1998-05-14', 'USA'),
(2, 'beatrix_k', 'hash_pw_987654', 'beatrix.k@example.com', '2001-11-22', 'UK'),
(3, 'charlie_z', 'hash_pw_456789', 'charlie.z@example.com', '1995-03-08', 'Canada'),
(4, 'david_l', 'hash_pw_112233', 'david.l@example.com', '2002-07-19', 'Australia'),
(5, 'eva_n', 'hash_pw_445566', 'eva.n@example.com', '1999-12-01', 'Germany');

INSERT INTO Artist (artist_id, name, bio, country) VALUES
(1, 'The Midnight Echo', 'Indie rock band formed in Brooklyn with atmospheric guitar sounds.', 'USA'),
(2, 'Aria Vance', 'Chart-topping pop and R&B singer-songwriter.', 'UK'),
(3, 'Luna Protocol', 'Electronic music duo specializing in synthwave and ambient beats.', 'Canada'),
(4, 'Quantum Echo', 'Experimental progressive metal unit blending jazz fusion.', 'Australia');

INSERT INTO Song (song_id, title, duration_seconds, release_date, like_count) VALUES
(101, 'Neon Reverie', 215, '2024-01-15', 2),
(102, 'Starlight Pulse', 198, '2024-01-15', 1),
(103, 'Midnight Highway', 240, '2023-11-03', 1),
(104, 'Velvet Horizon', 205, '2025-02-14', 2),
(105, 'Electric Heartbeat', 182, '2025-02-14', 0),
(106, 'Cyber City Lights', 310, '2023-08-20', 2),
(107, 'Solar Drift', 275, '2023-08-20', 0);

INSERT INTO Album (album_id, title, release_date, artist_id) VALUES
(10, 'Echoes in the Dark', '2024-01-15', 1),
(11, 'Velvet', '2025-02-14', 2),
(12, 'Synthetic Dreams', '2023-08-20', 3);

INSERT INTO Playlist (playlist_id, title, is_public, creation_date, user_id) VALUES
(1001, 'Late Night Chill', TRUE, '2026-01-10 21:15:00', 1),
(1002, 'Workout Energy', TRUE, '2026-02-01 08:30:00', 2),
(1003, 'Private Favorites', FALSE, '2026-02-15 14:05:00', 1),
(1004, 'Focus & Study', TRUE, '2026-03-01 11:20:00', 3);

INSERT INTO `Like` (user_id, song_id) VALUES
(1, 101),
(1, 103),
(1, 106),
(2, 102),
(2, 104),
(3, 106),
(4, 104),
(5, 101);

INSERT INTO `Add` (song_id, playlist_id) VALUES
(101, 1001),
(103, 1001),
(106, 1001),
(102, 1002),
(105, 1002),
(104, 1003),
(106, 1004),
(107, 1004);

INSERT INTO Contribute (artist_id, song_id, role) VALUES
(1, 101, 'Primary Artist'),
(1, 102, 'Primary Artist'),
(1, 103, 'Primary Artist'),
(2, 104, 'Primary Artist'),
(2, 105, 'Primary Artist'),
(3, 106, 'Primary Artist'),
(3, 107, 'Primary Artist'),
(2, 101, 'Featured Artist');

INSERT INTO Contain (album_id, song_id, track_number) VALUES
(10, 101, 1),
(10, 102, 2),
(10, 103, 3),
(11, 104, 1),
(11, 105, 2),
(12, 106, 1),
(12, 107, 2);
