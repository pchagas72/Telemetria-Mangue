import sqlite3
from datetime import datetime

DB_PATH = "./database/data/telemetria.db"


def conectar():
    return sqlite3.connect(DB_PATH)


def criar_sessao(descricao=None, modo="simulado"):
    conn = conectar()
    cursor = conn.cursor()

    data_atual = datetime.now().isoformat()
    cursor.execute("""
        INSERT INTO sessoes (data, descricao, modo)
        VALUES (?, ?, ?)
    """, (data_atual, descricao or "Sessão automática", modo))
    sessao_id = cursor.lastrowid
    conn.commit()
    conn.close()
    print(f"[DB] Sessão criada com ID {sessao_id}")
    return sessao_id


def criar_tabelas():
    con = conectar()
    cur = con.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS sessao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            inicio TEXT NOT NULL
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS dado (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sessao_id INTEGER NOT NULL,
            accx REAL, accy REAL, accz REAL,
            dpsx REAL, dpsy REAL, dpsz REAL,
            roll REAL, pitch REAL,
            rpm REAL, vel REAL,
            temp_motor REAL, soc REAL, temp_cvt REAL,
            volt REAL, current REAL, flags INTEGER,
            latitude REAL, longitude REAL, timestamp TEXT,
            FOREIGN KEY(sessao_id) REFERENCES sessao(id)
        );
    """)
    con.commit()
    con.close()
