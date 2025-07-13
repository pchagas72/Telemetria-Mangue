from datetime import datetime, timedelta
import pandas as pd
import os
import random


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
        dados = {
            "accx": round(random.uniform(-3, 3), 2),
            "accy": round(random.uniform(-3, 3), 2),
            "accz": round(random.uniform(-3, 3), 2),
            "dpsx": round(random.uniform(-3, 3), 2),
            "dpsy": round(random.uniform(-3, 3), 2),
            "dpsz": round(random.uniform(-3, 3), 2),
            "roll": round(random.uniform(-3, 3), 2),
            "pitch": round(random.uniform(-3, 3), 2),
            "rpm": round(random.uniform(0, 8000), 2),
            "vel": round(random.uniform(0, 60), 2),
            "temp_motor": round(random.uniform(60, 110), 2),
            "soc": round(random.uniform(0, 100), 2),
            "temp_cvt": round(random.uniform(50, 100), 2),
            "volt": round(random.uniform(10.5, 13.0), 2),
            "current": round(random.uniform(100, 500), 2),
            "flags": round(random.uniform(0, 1), 2),
            "latitude": round(-8.06 + random.uniform(-0.001, 0.001), 6),
            "longitude": round(-34.9 + random.uniform(-0.001, 0.001), 6),
        }

        self.timestamp_atual += timedelta(milliseconds=500)
        dados["timestamp"] = self.timestamp_atual.isoformat()

        return dados

    def receber_dados(self):
        pass

    def salvar_em_csv(self, dados):
        df_novo = pd.DataFrame([dados])
        print(df_novo.head())
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
