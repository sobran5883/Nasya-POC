import cgi
import sqlite3
import json

print("Content-Type: application/json\n")

form = cgi.FieldStorage()
action = form.getvalue("action")
response = {}

conn = sqlite3.connect('users.db')
cursor = conn.cursor()
try:
    if action == "add":
        name = form.getvalue("name")
        address = form.getvalue("address")
        if not name or not address:
            raise ValueError("Both name and address are required.")
        cursor.execute("INSERT INTO schools (name, address) VALUES (?, ?)", (name, address))
        conn.commit()
        response = {"status": "success", "message": "School added successfully"}

    elif action == "update":
        school_id = form.getvalue("id")
        new_name = form.getvalue("name")
        new_address = form.getvalue("address")
        if not school_id:
            raise ValueError("School ID is required.")
        if not new_name and not new_address:
            raise ValueError("At least one field (name or address) is required to update.")
        if new_name:
            cursor.execute("UPDATE schools SET name=? WHERE id=?", (new_name, school_id))
        if new_address:
            cursor.execute("UPDATE schools SET address=? WHERE id=?", (new_address, school_id))
        conn.commit()
        response = {"status": "success", "message": "School details updated successfully"}

    elif action == "list":
        cursor.execute("SELECT * FROM schools")
        schools = cursor.fetchall()
        response = {
            "status": "success",
            "schools": [{"id": row[0], "name": row[1], "address": row[2]} for row in schools]
        }
        
    elif action == "delete":
        school_id = form.getvalue("id")
        if not school_id:
            raise ValueError("School ID is required.")
        cursor.execute("DELETE FROM schools WHERE id=?", (school_id,))
        conn.commit()
        response = {"status": "success", "message": "School deleted successfully"}

    else:
        raise ValueError("Invalid action specified.")

except ValueError as e:
    response = {"status": "error", "message": str(e)}
except Exception as e:
    response = {"status": "error", "message": "An error occurred: " + str(e)}
finally:
    conn.close()

print(json.dumps(response))

