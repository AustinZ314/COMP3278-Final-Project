from db import get_connection

connection = get_connection()

try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) AS total_songs FROM Song")
        result = cursor.fetchone()
        print(result)
finally:
    connection.close()
