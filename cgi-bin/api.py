import sqlite3
import json
import cgi

print("Content-Type: application/json\n")

try:
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM schools")
    school_count = cursor.fetchone()[0]

    response = {
        "status": "success",
        "data": {
            "users": user_count,
            "schools": school_count
        }
    }

except Exception as e:
    response = {
        "status": "error",
        "message": str(e)
    }

finally:
    conn.close()

print(json.dumps(response))
