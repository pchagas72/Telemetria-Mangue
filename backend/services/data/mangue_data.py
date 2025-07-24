import math
import os
import random
from datetime import datetime, timedelta
import struct

import pandas as pd
import matplotlib.pyplot as plt
from fpdf import FPDF
from database.db import conectar


class MangueData:
    def __init__(self):
        self.ARQUIVO_CSV_PATH = "./output/telemetria.csv"
        self.timestamp_atual = datetime.now()
        self.CAMPOS_FIXOS = [
            "accx",
            "accy",
            "accz",
            "dpsx",
            "dpsy",
            "dpsz",
            "roll",
            "pitch",
            "rpm",
            "vel",
            "temp_motor",
            "soc",
            "temp_cvt",
            "volt",
            "current",
            "flags",
            "latitude",
            "longitude",
            "timestamp",
        ]
        self.inicio = datetime.now()
        self.vel_anterior = 0
        self.timestamp_atual = datetime.now()
        self.base_lat = -8.05428  # UFPE ou qualquer ponto fixo
        self.base_lon = -34.8813
        self.id_sessao_atual = None

    def gerar_dados(self):
        tempo_s = (datetime.now() - self.inicio).total_seconds()
        self.timestamp_atual += timedelta(milliseconds=500)

        vel = max(0, min(60, 30 + 15 * math.sin(tempo_s / 10)))
        rpm = vel * 120 + random.uniform(-200, 200)
        accx = (vel - self.vel_anterior) / 0.5

        dados = {
            "accx": round(accx, 2),
            "accy": round(random.uniform(-0.2, 0.2), 2),
            "accz": round(random.uniform(9.4, 9.8), 2),
            "dpsx": round(random.uniform(-1, 1), 2),
            "dpsy": round(random.uniform(-1, 1), 2),
            "dpsz": round(random.uniform(-1, 1), 2),
            "roll": round(random.uniform(-5, 5), 2),
            "pitch": round(random.uniform(-5, 5), 2),
            "rpm": round(rpm, 2),
            "vel": round(vel, 2),
            "temp_motor": round(min(110, 60 + tempo_s * 0.3), 1),
            "soc": round(max(0, 100 - tempo_s * 0.03), 1),
            "temp_cvt": round(min(95, 50 + tempo_s * 0.25), 1),
            "volt": round(13.0 - tempo_s * 0.001, 2),
            "current": round(random.uniform(150, 300), 1),
            "flags": 0,
            "latitude": round(self.base_lat + tempo_s * 0.00002, 6),
            "longitude": round(self.base_lon + math.sin(tempo_s / 20) * 0.0001, 6),
            "timestamp": self.timestamp_atual.isoformat(),
        }

        self.vel_anterior = vel
        return dados

    def receber_dados(self):
        pass

    def salvar_em_csv(self, dados):
        df_novo = pd.DataFrame([dados])
        if not os.path.exists(self.ARQUIVO_CSV_PATH):
            df_novo.to_csv(self.ARQUIVO_CSV_PATH, index=False)
        else:
            with open(self.ARQUIVO_CSV_PATH, mode="a", newline='') as f:
                df_novo.to_csv(f, header=False, index=False)
                f.flush()
                os.fsync(f.fileno())  # <- força escrita no disco

    def deletar_csv(self):
        if os.path.exists(self.ARQUIVO_CSV_PATH):
            try:
                pd.DataFrame(columns=self.CAMPOS_FIXOS).to_csv(
                    self.ARQUIVO_CSV_PATH, index=False
                )
                return {"mensagem": "Conteúdo apagado, cabeçalho preservado"}
            except Exception as e:
                return {"erro": f"Falha ao limpar arquivo: {str(e)}"}
        else:
            return {"mensagem": "Arquivo não encontrado"}

    def montar_relatorio(self, csv):
        df = pd.read_csv(csv.file)
        print(df.head())

        nome_pdf = "./output/relatorio_sessao.pdf"

        plt.figure(figsize=(6, 2))
        df["vel"].plot(title="Velocidade (km/h)", color="blue")
        plt.xlabel("Instante")
        plt.ylabel("Velocidade")
        plt.tight_layout()
        plt.savefig("./output/imagens/velocidade.png")
        plt.close()

        plt.figure(figsize=(6, 2))
        df["rpm"].plot(title="RPM", color="orange")
        plt.xlabel("Instante")
        plt.ylabel("RPM")
        plt.tight_layout()
        plt.savefig("./output/imagens/rpm.png")
        plt.close()

        plt.figure(figsize=(6, 2))
        df["accx"].plot(title="Aceleração X", color="green")
        plt.xlabel("Instante")
        plt.ylabel("m/s²")
        plt.tight_layout()
        plt.savefig("./output/imagens/accx.png")
        plt.close()

        # Gráfico CVT
        plt.figure(figsize=(6, 2))
        plt.scatter(df["vel"], df["rpm"], s=10, color="red")
        plt.title("CVT – RPM x Velocidade")
        plt.xlabel("Velocidade (km/h)")
        plt.ylabel("RPM")
        plt.tight_layout()
        plt.savefig("./output/imagens/cvt.png")
        plt.close()

        # PDF com fpdf2 e fonte UTF-8
        pdf = FPDF()
        pdf.add_page()

        # Adiciona fonte UTF-8
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
        if not os.path.exists(font_path):
            font_path = os.path.join(
                os.path.dirname(__file__), "../../core/misc/DejaVuSans.ttf"
            )  # fallback
        pdf.add_font("DejaVu", "", font_path, uni=True)
        pdf.set_font("DejaVu", size=12)

        pdf.cell(200, 10, txt="Relatório de Sessão – Mangue Baja UFPE", ln=True)
        pdf.ln(5)

        pdf.cell(200, 10, txt=f"Duração: {len(df)*0.5:.1f} s", ln=True)
        pdf.cell(200, 10, txt=f"Velocidade média: {df['vel'].mean():.2f} km/h", ln=True)
        pdf.cell(200, 10, txt=f"RPM máximo: {df['rpm'].max()}", ln=True)
        pdf.cell(
            200, 10, txt=f"Temperatura motor máx: {df['temp_motor'].max()} °C", ln=True
        )
        pdf.cell(200, 10, txt=f"SOC final: {df['soc'].iloc[-1]} %", ln=True)
        pdf.ln(5)
        pdf.image("./output/imagens/rpm.png", x=10, w=180)
        pdf.ln(5)
        pdf.image("./output/imagens/accx.png", x=10, w=180)
        pdf.ln(5)
        pdf.image("./output/imagens/cvt.png", x=10, w=180)
        pdf.ln(5)
        pdf.image("./output/imagens/velocidade.png", x=10, w=180)
        pdf.output(nome_pdf)
        return nome_pdf

    def iniciar_nova_sessao(self):
        con = conectar()
        cur = con.cursor()
        cur.execute("INSERT INTO sessao (inicio) VALUES (?)", (datetime.now().isoformat(),))
        self.id_sessao_atual = cur.lastrowid
        con.commit()
        con.close()

    def salvar_em_db(self, dados):
        if self.id_sessao_atual is None:
            self.iniciar_nova_sessao()

        # Verificação de integridade
        campos = list(dados.keys())
        valores = list(dados.values())

        if len(campos) != len(valores):
            print("[ERRO] Campos e valores com tamanhos diferentes")
            return

        print("[DB] Salvando dados na sessão:", self.id_sessao_atual)
        try:
            con = conectar()
            cur = con.cursor()

            campos_sql = ",".join(campos)
            placeholders = ",".join(["?"] * len(campos))
            sql = f"""
                INSERT INTO dado (sessao_id, {campos_sql})
                VALUES (?, {placeholders})
            """

            cur.execute(sql, [self.id_sessao_atual] + valores)
            con.commit()
        except Exception as e:
            print(f"[ERRO] Falha ao salvar no banco: {e}")
        finally:
            con.close()

    def parse_mqtt_packet(self, payload: bytes) -> dict:
        fmt = "<fbbfbhhhhhhhhhhbddi"

        if len(payload) != struct.calcsize(fmt):
            raise ValueError(f"tamanho inesperado: {len(payload)} bytes (esperado {struct.calcsize(fmt)})")
        (
            volt, soc, cvt, current, temperature, speed,
            acc_x, acc_y, acc_z,
            dps_x, dps_y, dps_z,
            roll, pitch,
            rpm, flags,
            latitude, longitude,
            timestamp
        ) = struct.unpack(fmt, payload)

        return {
            "accx": acc_x,
            "accy": acc_y,
            "accz": acc_z,
            "dpsx": dps_x,
            "dpsy": dps_y,
            "dpsz": dps_z,
            "roll": roll,
            "pitch": pitch,
            "rpm": rpm,
            "vel": speed,
            "temp_motor": temperature,
            "soc": soc,
            "temp_cvt": cvt,
            "volt": volt,
            "current": current,
            "flags": flags,
            "latitude": latitude,
            "longitude": longitude,
            "timestamp": timestamp,
        }
