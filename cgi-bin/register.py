import cgi
import sqlite3
import json

print("Content-Type: application/json\n")

form = cgi.FieldStorage()
username = form.getvalue("username")
password = form.getvalue("password")

conn = sqlite3.connect('users.db')
cursor = conn.cursor()

try:
    cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
    conn.commit()
    print(json.dumps({"status": "success", "message": "Registration successful"}))
except sqlite3.IntegrityError:
    print(json.dumps({"status": "error", "message": "Username already exists"}))

conn.close()
