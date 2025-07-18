import serial
import asyncio
from fastapi import WebSocket
import random


class BluetoothDebugger:
    def __init__(self, porta="/dev/rfcomm0", baudrate=9600, simulate=False):
        self.simulate = simulate
        self.websockets = []

        if not self.simulate:
            try:
                self.serial = serial.Serial(porta, baudrate, timeout=1)
                print(f"[BluetoothDebugger] Conectado em {porta} a {baudrate}bps")
            except Exception as e:
                print(f"[BluetoothDebugger] Falha ao abrir porta '{porta}': {e}\nModo simulado ativado.")
                self.simulate = True

    def enviar_comando(self, cmd="MD"):
        if self.simulate:
            print(f"[BluetoothDebugger] (Simulado) Enviando comando: {cmd}")
        else:
            self.serial.write(f"{cmd}\n".encode())  # Envia o comando

    def ler_resposta(self):
        if self.simulate:
            # Gera uma resposta simulada
            respostas = [
                "OK: Sistema operacional funcionando",
                "WARN: Temperatura do MOTOR alta",
                "ERROR: Falha no sensor de velocidade",
                "INFO: Iniciando diagnóstico"
            ]
            return random.choice(respostas)

        linhas = []
        while self.serial.in_waiting:
            linha = self.serial.readline().decode(errors="ignore").strip()
            if linha:
                linhas.append(linha)
        return "\n".join(linhas)

    async def registrar_websocket(self, websocket: WebSocket):
        await websocket.accept()
        self.websockets.append(websocket)
        # Mantém a conexão viva
        while True:
            await asyncio.sleep(1)

    async def broadcast(self, dado):
        for ws in list(self.websockets):
            try:
                await ws.send_text(dado)
            except:
                self.websockets.remove(ws)
