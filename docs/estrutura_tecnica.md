# 🧱 Estrutura Técnica do Projeto

Este documento explica como o sistema de telemetria Mangue Baja está organizado em termos de código, tecnologias e responsabilidade de cada módulo.

## 📁 Backend (`/backend`)

Servidor HTTP + WebSocket com FastAPI, geração de PDF com matplotlib e fpdf2, simulação ou leitura de dados via CSV.

### Principais arquivos:

- `main.py`: rotas da aplicação (telemetria, replay, PDF)
- `mangue_data.py`: simula dados ou acessa dados reais
- `debugger.py`: interface com ECUs via Bluetooth ou simulação
- `relatorio_sessao.pdf`: arquivo gerado com estatísticas da sessão

## 📁 Frontend (`/frontend`)

- `index.html`: tempo real
- `replay.html`: replay de CSV
- `script.js`: lógica dos gráficos e mapas (tempo real)
- `replay.js`: replay e PDF
- `style.css`, `manifest.json`, `service-worker.js`: responsividade e PWA
- `common.js`: funções JS reutilizáveis

## 📁 Scripts (`/scripts`)

- `bluetooth_adapter.sh`: script para parear/adaptar Bluetooth via CLI

## 📁 Dados (`/backend/data/`)

- `telemetria.csv`: sessão em tempo real ou carregada
- `sessions/`: sessões arquivadas (replay)
- `*.png`: gráficos exportados temporários para PDF