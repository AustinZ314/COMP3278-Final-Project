from flask import Flask, jsonify, request
from db import get_connection

app = Flask(__name__)


@app.get("/api/songs/count")
def count_songs():
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) AS total_songs FROM Song")
            result = cursor.fetchone()

        return jsonify(result)
    finally:
        connection.close()

@app.get("/api/songs")
def get_songs():
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    s.song_id,
                    s.title,
                    s.duration_seconds,
                    a.name AS artist_name
                FROM Song s
                LEFT JOIN Contribute AS c
                    ON s.song_id = c.song_id
                    AND c.role = 'Primary Artist'
                LEFT JOIN Artist AS a
                    ON c.artist_id = a.artist_id
                ORDER BY s.song_id
            """)
            songs = cursor.fetchall()

        return jsonify(songs)
    finally:
        connection.close()

@app.get("/api/users/<int:user_id>/playlists")
def get_user_playlists(user_id):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT playlist_id, title, is_public
                FROM Playlist
                WHERE user_id = %s
                ORDER BY playlist_id
            """, (user_id,))
            playlists = cursor.fetchall()

        return jsonify(playlists)
    finally:
        connection.close()

@app.post("/api/users/<int:user_id>/playlists")
def create_playlist(user_id):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "A JSON object is required"}), 400

    title = data.get("title")

    if not isinstance(title, str) or not title.strip():
        return jsonify({"error": "A playlist title is required"}), 400

    is_public = data.get("is_public", True)

    title = title.strip()

    if len(title) > 100:
        return jsonify({"error": "Title cannot exceed 100 characters"}), 400


    if not isinstance(is_public, bool):
        return jsonify({"error": "is_public must be true or false"}), 400

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT user_id FROM User WHERE user_id = %s",
                (user_id,)
            )

            if cursor.fetchone() is None:
                return jsonify({"error": "User not found"}), 404

            cursor.execute("""
                INSERT INTO Playlist (title, is_public, user_id)
                VALUES (%s, %s, %s)
            """, (title, is_public, user_id))

            playlist_id = cursor.lastrowid


        connection.commit()

        return jsonify({
            "playlist_id": playlist_id,
            "title": title.strip(),
            "is_public": is_public,
            "user_id": user_id
        }), 201
    finally:
        connection.close()

@app.patch("/api/users/<int:user_id>/playlists/<int:playlist_id>")
def update_playlist(user_id, playlist_id):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "A JSON object is required"}), 400

    title = data.get("title")

    if not isinstance(title, str) or not title.strip():
        return jsonify({"error": "A playlist title is required"}), 400

    title = title.strip()

    if len(title) > 100:
        return jsonify({"error": "Title cannot exceed 100 characters"}), 400

    connection = get_connection()

    try:

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT playlist_id
                FROM Playlist
                WHERE playlist_id = %s AND user_id = %s
            """, (playlist_id, user_id))

            if cursor.fetchone() is None:
                return jsonify({"error": "Playlist not found"}), 404

            cursor.execute("""
                UPDATE Playlist
                SET title = %s
                WHERE playlist_id = %s AND user_id = %s
            """, (title, playlist_id, user_id))


        connection.commit()

        return jsonify({
            "playlist_id": playlist_id,
            "title": title,
            "user_id": user_id
        })
    finally:
        connection.close()

@app.delete("/api/users/<int:user_id>/playlists/<int:playlist_id>")
def delete_playlist(user_id, playlist_id):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                DELETE FROM Playlist
                WHERE playlist_id = %s AND user_id = %s
            """, (playlist_id, user_id))

            deleted_rows = cursor.rowcount

        if deleted_rows == 0:
            return jsonify({"error": "Playlist not found"}), 404

        connection.commit()

        return "", 204
    finally:
        connection.close()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001)
