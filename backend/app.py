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

@app.get("/api/playlists/<int:playlist_id>/songs")
def get_playlist_songs(playlist_id):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    s.song_id,
                    s.title,
                    s.duration_seconds
                FROM `Add` AS a
                JOIN Song AS s
                    ON a.song_id = s.song_id
                WHERE a.playlist_id = %s
                ORDER BY s.song_id
            """, (playlist_id,))

            songs = cursor.fetchall()

        return jsonify(songs)
    finally:
        connection.close()

@app.get("/api/users/<int:user_id>/likes")
def get_user_likes(user_id):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    s.song_id,
                    s.title,
                    s.duration_seconds
                FROM `Like` AS l
                JOIN Song AS s
                    ON l.song_id = s.song_id
                WHERE l.user_id = %s
                ORDER BY s.song_id
            """, (user_id,))

            songs = cursor.fetchall()

        return jsonify(songs)
    finally:
        connection.close()

@app.post("/api/users/<int:user_id>/likes")
def like_song(user_id):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "A JSON object is required"}), 400

    song_id = data.get("song_id")

    if type(song_id) is not int or song_id <= 0:
        return jsonify({"error": "A valid song_id is required"}), 400

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT user_id FROM User WHERE user_id = %s",
                (user_id,)
            )

            if cursor.fetchone() is None:
                return jsonify({"error": "User not found"}), 404

            cursor.execute(
                "SELECT song_id FROM Song WHERE song_id = %s",
                (song_id,)
            )

            if cursor.fetchone() is None:
                return jsonify({"error": "Song not found"}), 404

            cursor.execute("""
                SELECT song_id
                FROM `Like`
                WHERE user_id = %s AND song_id = %s
            """, (user_id, song_id))

            if cursor.fetchone() is not None:
                return jsonify({"error": "Song already liked"}), 409

            cursor.execute("""
                INSERT INTO `Like` (user_id, song_id)
                VALUES (%s, %s)
            """, (user_id, song_id))

            cursor.execute("""
                UPDATE Song
                SET like_count = like_count + 1
                WHERE song_id = %s
            """, (song_id,))

        connection.commit()

        return jsonify({
            "user_id": user_id,
            "song_id": song_id
        }), 201
    finally:
        connection.close()

@app.delete("/api/users/<int:user_id>/likes/<int:song_id>")
def unlike_song(user_id, song_id):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                DELETE FROM `Like`
                WHERE user_id = %s AND song_id = %s
            """, (user_id, song_id))

            deleted_rows = cursor.rowcount

            if deleted_rows == 0:
                return jsonify({"error": "Song not liked"}), 404

            cursor.execute("""
                UPDATE Song
                SET like_count = GREATEST(like_count - 1, 0)
                WHERE song_id = %s
            """, (song_id,))

        connection.commit()

        return "", 204
    finally:
        connection.close()


@app.post("/api/playlists/<int:playlist_id>/songs")
def add_playlist_song(playlist_id):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "A JSON object is required"}), 400

    song_id = data.get("song_id")

    if type(song_id) is not int or song_id <= 0:
        return jsonify({"error": "A valid song_id is required"}), 400

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT playlist_id FROM Playlist WHERE playlist_id = %s",
                (playlist_id,)
            )

            if cursor.fetchone() is None:
                return jsonify({"error": "Playlist not found"}), 404

            cursor.execute(
                "SELECT song_id FROM Song WHERE song_id = %s",
                (song_id,)
            )

            if cursor.fetchone() is None:
                return jsonify({"error": "Song not found"}), 404

            cursor.execute("""
                SELECT song_id
                FROM `Add`
                WHERE playlist_id = %s AND song_id = %s
            """, (playlist_id, song_id))

            if cursor.fetchone() is not None:
                return jsonify({"error": "Song already in playlist"}), 409

            cursor.execute("""
                INSERT INTO `Add` (song_id, playlist_id)
                VALUES (%s, %s)
            """, (song_id, playlist_id))

        connection.commit()

        return jsonify({
            "playlist_id": playlist_id,
            "song_id": song_id
        }), 201
    finally:
        connection.close()

@app.delete("/api/playlists/<int:playlist_id>/songs/<int:song_id>")
def remove_playlist_song(playlist_id, song_id):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                DELETE FROM `Add`
                WHERE playlist_id = %s AND song_id = %s
            """, (playlist_id, song_id))

            deleted_rows = cursor.rowcount

        if deleted_rows == 0:
            return jsonify({"error": "Song not found in playlist"}), 404

        connection.commit()

        return "", 204
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
