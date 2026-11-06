CREATE DATABASE IF NOT EXISTS music_streaming_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;
USE music_streaming_db;

-- Drop in reverse order of dependencies if re-running script
DROP TABLE IF EXISTS Contain;
DROP TABLE IF EXISTS Contribute;
DROP TABLE IF EXISTS `Add`;
DROP TABLE IF EXISTS `Like`;
DROP TABLE IF EXISTS Playlist;
DROP TABLE IF EXISTS Album;
DROP TABLE IF EXISTS Song;
DROP TABLE IF EXISTS Artist;
DROP TABLE IF EXISTS User;

CREATE TABLE User (
    user_id INT AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    birth_date DATE,
    country VARCHAR(50),
    PRIMARY KEY(user_id)
);

CREATE TABLE Artist (
    artist_id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    country VARCHAR(50),
    PRIMARY KEY(artist_id)
);

CREATE TABLE Song (
    song_id INT AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    duration_seconds INT NOT NULL,
    release_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    like_count INT NOT NULL DEFAULT 0,
    PRIMARY KEY(song_id)
);

CREATE TABLE Album (
    album_id INT AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    release_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    artist_id INT NOT NULL,
    PRIMARY KEY(album_id),
    FOREIGN KEY (artist_id) REFERENCES Artist(artist_id) ON DELETE CASCADE
);

CREATE TABLE Playlist (
    playlist_id INT AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    PRIMARY KEY(playlist_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Backticks used to avoid SQL reserved keywords
CREATE TABLE `Like` (
    user_id INT,
    song_id INT,
    PRIMARY KEY (user_id, song_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES Song(song_id) ON DELETE CASCADE
);

CREATE TABLE `Add` (
    song_id INT,
    playlist_id INT,
    PRIMARY KEY (song_id, playlist_id),
    FOREIGN KEY (song_id) REFERENCES Song(song_id) ON DELETE CASCADE,
    FOREIGN KEY (playlist_id) REFERENCES Playlist(playlist_id) ON DELETE CASCADE
);

CREATE TABLE Contribute (
    artist_id INT,
    song_id INT,
    role VARCHAR(50) NOT NULL DEFAULT 'Primary Artist',
    PRIMARY KEY (artist_id, song_id),
    FOREIGN KEY (artist_id) REFERENCES Artist(artist_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES Song(song_id) ON DELETE CASCADE
);

CREATE TABLE Contain (
    album_id INT,
    song_id INT,
    track_number INT NOT NULL,
    PRIMARY KEY (album_id, song_id),
    FOREIGN KEY (album_id) REFERENCES Album(album_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES Song(song_id) ON DELETE CASCADE
);
