-- backend/database/schema.sql

CREATE TABLE IF NOT EXISTS sessoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    descricao TEXT,
    modo TEXT DEFAULT 'real'
);

CREATE TABLE IF NOT EXISTS telemetria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sessao_id INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    accx REAL, accy REAL, accz REAL,
    dpsx REAL, dpsy REAL, dpsz REAL,
    roll REAL, pitch REAL,
    rpm REAL, vel REAL,
    temp_motor REAL, soc REAL, temp_cvt REAL,
    volt REAL, current REAL,
    flags INTEGER,
    latitude REAL, longitude REAL,
    FOREIGN KEY (sessao_id) REFERENCES sessoes(id)
);

