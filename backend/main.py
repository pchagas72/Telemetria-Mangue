from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi import UploadFile, File
from fastapi import Request
from starlette.websockets import WebSocketDisconnect
import aiomqtt
import asyncio
import json
import os
import shutil
from data.mangue_data import MangueData
from debug.debugger import BluetoothDebugger
from pathlib import Path


app = FastAPI()

frontend_path = os.path.join(os.path.dirname(__file__), "../frontend")
app.mount("/app", StaticFiles(directory=frontend_path, html=True), name="frontend")

MD = MangueData()
porta_bt = "/dev/rfcomm0"
usar_simulacao = not os.path.exists(porta_bt)
debugger = BluetoothDebugger(porta_bt, 9600, simulate=usar_simulacao)
simular_interface = True
last_data = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou restrinja para ["http://192.168.X.X:8000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/app")
async def home():
    return FileResponse(os.path.join(frontend_path, "index.html"))


@app.get("/replay")
async def replay():
    return FileResponse(os.path.join(frontend_path, "replay.html"))


@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            if simular_interface:
                data = MD.gerar_dados()
                await websocket.send_text(json.dumps(data))
                MD.salvar_em_csv(data)
            else:
                async with aiomqtt.Client("localhost") as client:
                    await client.subscribe("telemetria/mangue")
                    async for data in client.messages:
                        print(data)
                        await websocket.send_text(
                            json.dumps(json.loads(data.payload.decode()))
                        )
            await asyncio.sleep(0.0001)
    except WebSocketDisconnect:
        print("[WebSocket] Cliente desconectado")
    except Exception as e:
        print("[WebSocket] Erro inesperado:", e)


@app.get("/download_csv")
async def download_csv():
    print("Pedido para baixar CSV recebido")
    arquivo_original = Path(MD.ARQUIVO_CSV_PATH).resolve()
    if not arquivo_original.exists():
        return {"error": "Arquivo não encontrado"}

    temp_path = Path("./data/temp_telemetria.csv").resolve()
    shutil.copyfile(arquivo_original, temp_path)

    return FileResponse(
        path=str(temp_path),
        media_type="text/csv",
        filename="dados.csv"
    )


@app.post("/debug")
async def acionar_debug():
    print("Pedido para realizar debug recebido")
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
    print("Pedido para gerar PDF recebido")
    nome_pdf = MD.montar_relatorio(csv)
    return FileResponse(nome_pdf, media_type="application/pdf", filename=nome_pdf)


@app.delete("/deletar_run")
async def deletar_csv():
    MD.deletar_csv()


@app.post("/sinal")
async def receber_sinal(request: Request):
    dados = await request.json()
    print("✅ Sinal recebido do frontend:", dados)
    return {"status": "ok", "mensagem": "Sinal recebido com sucesso!"}
