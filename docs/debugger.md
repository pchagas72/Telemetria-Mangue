# 🔍 Debugger via Bluetooth ou Simulado

O modo de debug permite se comunicar com as ECUs do carro e diagnosticar problemas em tempo real.

## 🧠 Como funciona

- Ao enviar o comando `MD`, o carro responde com status das ECUs
- O sistema processa e exibe os erros na interface

## 🔌 Conexão via Bluetooth

1. Conecte o dongle via USB
2. Use o script:
   ```bash
   ./scripts/extra/bluetooth_adapter.sh
   ```
3. O sistema tentará usar `/dev/rfcomm0` automaticamente

## ⚙️ Simulado (fallback)

Se o Bluetooth não estiver disponível, o sistema responde com dados simulados, úteis para testes.