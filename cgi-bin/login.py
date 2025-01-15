import cgi
import sqlite3
import json

print("Content-Type: application/json\n")

form = cgi.FieldStorage()
username = form.getvalue("username")
password = form.getvalue("password")

conn = sqlite3.connect('users.db')
cursor = conn.cursor()

cursor.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
user = cursor.fetchone()

if user:
    print(json.dumps({"status": "success", "message": "Login successful", "redirect": "home.html"}))
else:
    print(json.dumps({"status": "error", "message": "Invalid username or password"}))

conn.close()
