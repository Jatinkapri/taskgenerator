
import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from models import init_db, save_spec, get_last_specs
from llm_service import generate_tasks

load_dotenv()

app = Flask(__name__)
CORS(app)
init_db()

@app.route("/")
def home():
    return jsonify({"message": "Task Generator Backend Running"})

@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.json
    required = ["goal", "users", "constraints", "template"]

    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    result = generate_tasks(data)
    save_spec(data, result)
    return jsonify(result)

@app.route("/api/history", methods=["GET"])
def history():
    return jsonify(get_last_specs())

@app.route("/api/status", methods=["GET"])
def status():
    try:
        conn = sqlite3.connect("database.db")
        conn.execute("SELECT 1")
        db_status = "ok"
    except:
        db_status = "error"

    return jsonify({
        "backend": "ok",
        "database": db_status,
        "llm": "configured"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
