# COMP3278 Final Project — Backend

Flask backend for the Group 33 music streaming application, using MySQL for songs, artists, playlists and liked songs.

## Tech Stack

- Python 3
- Flask
- PyMySQL
- MySQL 8.4

## Running Locally

From the repository root, create a Python virtual environment and install the dependencies:

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
```

Copy `backend/.env.example` to `backend/.env` and update the database connection details.

```bash
cp backend/.env.example backend/.env
```

The default configuration uses `127.0.0.1:3307`, which matches the Docker MySQL instance used during backend development. Change the port if your MySQL server uses a different one.

## Database

The repository contains two SQL scripts:

- `create_database.sql` — creates the database and tables
- `insert_sample_data.sql` — inserts sample records

For a new database, run the scripts in that order. If you have the MySQL command-line client installed locally, you can run:

```bash
mysql -h 127.0.0.1 -P 3307 -u root -p < create_database.sql
mysql -h 127.0.0.1 -P 3307 -u root -p music_streaming_db < insert_sample_data.sql
```

MySQL can run locally or through Docker. The backend was developed using a separate MySQL 8.4 Docker container named `comp3278-group33-mysql`, with port 3307 mapped to the host.

## Starting the Backend

With MySQL running and `backend/.env` configured:

```bash
python backend/test_connection.py
python backend/app.py
```

The API runs at `http://127.0.0.1:5001`.

## API Routes

**Songs and artists**

- `GET /api/songs/count`
- `GET /api/songs`
- `GET /api/artists`

**Playlists**

- `GET /api/users/<user_id>/playlists`
- `POST /api/users/<user_id>/playlists`
- `PATCH /api/users/<user_id>/playlists/<playlist_id>`
- `DELETE /api/users/<user_id>/playlists/<playlist_id>`
- `GET /api/playlists/<playlist_id>/songs`
- `POST /api/playlists/<playlist_id>/songs`
- `DELETE /api/playlists/<playlist_id>/songs/<song_id>`

**Liked songs**

- `GET /api/users/<user_id>/likes`
- `POST /api/users/<user_id>/likes`
- `DELETE /api/users/<user_id>/likes/<song_id>`

## Testing

With Flask running, you can check the catalogue endpoints:

```bash
curl http://127.0.0.1:5001/api/songs
curl http://127.0.0.1:5001/api/artists
```

The sample database contains 7 songs and 4 artists.

## Notes

- The backend currently uses sample user IDs rather than authentication.
- The React frontend is maintained separately and still needs to be connected to these API routes.
- Keep database credentials in `backend/.env`, which is excluded from Git.
