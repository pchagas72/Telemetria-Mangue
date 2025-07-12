from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import asyncio
import json
import os
from data.mangue_data import MangueData
from debug.debugger import BluetoothDebugger
from fastapi import UploadFile, File
import pandas as pd
import matplotlib.pyplot as plt
from fpdf import FPDF


app = FastAPI()
MD = MangueData()
porta_bt = "/dev/rfcomm0"
usar_simulacao = not os.path.exists(porta_bt)
debugger = BluetoothDebugger(porta_bt, 9600, simulate=usar_simulacao)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "API de Telemetria Rodando"}


@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = MD.gerar_dados()
        await websocket.send_text(json.dumps(data))
        MD.salvar_em_csv(data)
        await asyncio.sleep(1)


@app.get("/download_csv")
async def download_csv():
    arquivo = MD.ARQUIVO_CSV_PATH
    if os.path.exists(arquivo):
        return FileResponse(arquivo, media_type='text/csv', filename=arquivo)
    else:
        return {"error": "Arquivo não encontrado"}


@app.post("/debug")
async def acionar_debug():
    debugger.enviar_comando("MB")
    await asyncio.sleep(1.0)  # Tempo para o carro responder
    resposta = debugger.ler_resposta()
    await debugger.broadcast(resposta)
    return {"status": "ok", "resposta": resposta}


@app.websocket("/ws/debug")
async def websocket_debug(websocket: WebSocket):
    await debugger.registrar_websocket(websocket)


@app.post("/gerar_pdf")
async def gerar_pdf(csv: UploadFile = File(...)):
    df = pd.read_csv(csv.file)

    nome_pdf = "relatorio_sessao.pdf"

    # Gráfico de velocidade
    plt.figure(figsize=(6, 2))
    df['vel'].plot(title='Velocidade (km/h)', color='blue')
    plt.xlabel('Instante')
    plt.ylabel('Velocidade')
    plt.tight_layout()
    plt.savefig("velocidade.png")
    plt.close()

    # PDF com fpdf2 e fonte UTF-8
    pdf = FPDF()
    pdf.add_page()

    # Adiciona fonte UTF-8
    font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    if not os.path.exists(font_path):
        font_path = "DejaVuSans.ttf"  # fallback (coloque esse ttf na raiz do projeto)
    pdf.add_font("DejaVu", "", font_path, uni=True)
    pdf.set_font("DejaVu", size=12)

    pdf.cell(200, 10, txt="Relatório de Sessão – Mangue Baja UFPE", ln=True)
    pdf.ln(5)

    pdf.cell(200, 10, txt=f"Duração: {len(df)*0.5:.1f} s", ln=True)
    pdf.cell(200, 10, txt=f"Velocidade média: {df['vel'].mean():.2f} km/h", ln=True)
    pdf.cell(200, 10, txt=f"RPM máximo: {df['rpm'].max()}", ln=True)
    pdf.cell(200, 10, txt=f"Temperatura motor máx: {df['temp_motor'].max()} °C", ln=True)
    pdf.cell(200, 10, txt=f"SOC final: {df['soc'].iloc[-1]} %", ln=True)
    pdf.ln(5)

    pdf.image("velocidade.png", x=10, w=180)

    pdf.output(nome_pdf)
    return FileResponse(nome_pdf, media_type="application/pdf", filename=nome_pdf)


@app.delete("/deletar_run")
async def deletar_csv():
    caminho = "./data/telemetria.csv"
    if os.path.exists(caminho):
        os.remove(caminho)
        return {"mensagem": "Arquivo deletado com sucesso"}
    else:
        return {"mensagem": "Arquivo não encontrado"}
