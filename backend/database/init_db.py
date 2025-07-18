# backend/database/init_db.py
import sqlite3

DB_PATH = "../database/data/telemetria.db"


def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        with open("../database/schema.sql", "r") as f:
            conn.executescript(f.read())
        print("[DB] Banco inicializado com sucesso!")


if __name__ == "__main__":
    init_db()
