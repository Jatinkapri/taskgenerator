
import sqlite3
import json
from datetime import datetime

def init_db():
    conn = sqlite3.connect("database.db")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS specs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            input TEXT,
            output TEXT,
            created_at TEXT
        )
    """)
    conn.close()

def save_spec(input_data, output_data):
    conn = sqlite3.connect("database.db")
    conn.execute(
        "INSERT INTO specs (input, output, created_at) VALUES (?, ?, ?)",
        (json.dumps(input_data), json.dumps(output_data), datetime.now().isoformat())
    )
    conn.commit()
    conn.close()

def get_last_specs():
    conn = sqlite3.connect("database.db")
    rows = conn.execute(
        "SELECT id, output, created_at FROM specs ORDER BY id DESC LIMIT 5"
    ).fetchall()
    conn.close()

    return [
        {"id": r[0], "output": json.loads(r[1]), "created_at": r[2]}
        for r in rows
    ]
