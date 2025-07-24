import asyncio
import json
import os
import shutil
import platform
from pathlib import Path

import aiomqtt
from fastapi import FastAPI, WebSocket
from fastapi.responses import FileResponse
from fastapi import UploadFile, File
from fastapi import Request
from starlette.websockets import WebSocketDisconnect

from services.data.mangue_data import MangueData
from services.debug.debugger import BluetoothDebugger
from core.config import setup_cors
from database.db import criar_sessao
from database.db import criar_tabelas

# Corrige problema com asyncio no Windows
if platform.system() == "Windows":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

app = FastAPI()

MD = MangueData()
PORTA_BT = "/dev/rfcomm0"
usar_simulacao = not os.path.exists(PORTA_BT)
debugger = BluetoothDebugger(PORTA_BT, 9600, simulate=usar_simulacao)
SIMULAR_INTERFACE = False
setup_cors(app)

if SIMULAR_INTERFACE:
    MD.id_sessao_atual = criar_sessao("Teste de simulação")
else:
    MD.id_sessao_atual = criar_sessao("Telemetria MQTT")

criar_tabelas()


@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            if SIMULAR_INTERFACE:
                data = MD.gerar_dados()
                await websocket.send_text(json.dumps(data))
                MD.salvar_em_csv(data)
                MD.salvar_em_db(data)
            else:
                async with aiomqtt.Client(
                    hostname="69.55.61.114",
                    port=1883,
                    username="manguebaja",
                    password="Rolabosta1417"
                ) as client:
                    await client.subscribe("/logging")
                    async for data in client.messages:
                        payload = data.payload
                        dados = MD.parse_mqtt_packet(payload)
                        #MD.salvar_em_db(dados)
                        await websocket.send_text(json.dumps(dados))
            await asyncio.sleep(0.01)
    except WebSocketDisconnect:
        print("[WebSocket] Cliente desconectado")
    except Exception as e:
        print("[WebSocket] Erro inesperado:", e)


@app.get("/download_csv")
async def download_csv():
    arquivo_original = Path(MD.ARQUIVO_CSV_PATH).resolve()
    if not arquivo_original.exists():
        return {"error": "Arquivo não encontrado"}

    temp_path = Path("./output/temp_telemetria.csv").resolve()
    shutil.copyfile(arquivo_original, temp_path)

    return FileResponse(
        path=str(temp_path),
        media_type="text/csv",
        filename="dados.csv"
    )


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
    nome_pdf = MD.montar_relatorio(csv)
    return FileResponse(
        nome_pdf,
        media_type="application/pdf",
        filename=nome_pdf)


@app.delete("/deletar_run")
async def deletar_csv():
    MD.deletar_csv()


@app.post("/sinal")
async def receber_sinal(request: Request):
    dados = await request.json()
    print("✅ Sinal recebido do frontend:", dados)
    return {"status": "ok", "mensagem": "Sinal recebido com sucesso!"}
