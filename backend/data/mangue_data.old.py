from datetime import datetime, timedelta
import pandas as pd
import os
import random
import math


class MangueData():
    def __init__(self):
        self.ARQUIVO_CSV_PATH = "./data/telemetria.csv"
        self.timestamp_atual = datetime.now()
        self.CAMPOS_FIXOS = [
            "accx", "accy", "accz", "dpsx", "dpsy", "dpsz", "roll", "pitch",
            "rpm", "vel", "temp_motor", "soc", "temp_cvt", "volt", "current",
            "flags", "latitude", "longitude", "timestamp"
        ]

    def gerar_dados(self):

        tempo_s = (datetime.now() - self.inicio).total_seconds()
        self.timestamp_atual += timedelta(milliseconds=500)

        vel = max(0, min(60, 30 + 15 * math.sin(tempo_s / 10)))
        rpm = vel * 120 + random.uniform(-200, 200)  # rpm proporcional com ruído
        accx = (vel - self.vel_anterior) / 0.5  # aceleração aproximada

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
            "timestamp": self.timestamp_atual.isoformat()
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
            df_novo.to_csv(self.ARQUIVO_CSV_PATH, mode='a', header=False, index=False)

    def deletar_csv(self):
        if os.path.exists(self.ARQUIVO_CSV_PATH):
            try:
                pd.DataFrame(columns=self.CAMPOS_FIXOS).to_csv(self.ARQUIVO_CSV_PATH, index=False)
                return {"mensagem": "Conteúdo apagado, cabeçalho preservado"}
            except Exception as e:
                return {"erro": f"Falha ao limpar arquivo: {str(e)}"}
        else:
            return {"mensagem": "Arquivo não encontrado"}
