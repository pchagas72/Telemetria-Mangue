# Mangue Baja - Sistema de Telemetria

Sistema de telemetria completo para a equipe Mangue Baja UFPE, desenvolvido com foco em visualização, diagnóstico e análise de desempenho durante provas e testes.

---

## ✅ Funcionalidades Implementadas

### 📡 Coleta e Transmissão

* Backend com **FastAPI**
* Telemetria em tempo real via **WebSocket**
* Suporte a **modo simulado** (sem o carro conectado)
* Debugger via **Bluetooth RFCOMM** (modo serial), com fallback para simulação

### 📊 Interface Web

* Painel responsivo com **Chart.js**
* Gráficos de velocidade, RPM, temperatura, aceleração e bateria
* Diagnóstico automático com alertas visuais
* Mapa interativo com **Leaflet.js** (visualização do trajeto via GPS)
* Barra visual de SOC com tensão e corrente

### 🔁 Replay de Sessão

* Upload de CSV e replay dos dados com sincronização por timestamp
* Gráficos e mapa reproduzem o trajeto em tempo real
* Barra de progresso e controle interativo

### 📄 Exportação

* Geração de PDF no backend com **fpdf2** e **matplotlib**
* PDF inclui estatísticas e gráfico de velocidade
* Botão para exclusão do arquivo CSV da sessão

---

## 📦 Como executar

```bash
# Instalar dependências
pip install -r requirements.txt

# Rodar backend
uvicorn main:app --reload
```

Acesse a interface via `index.html` (tempo real) ou `replay.html` (replay).

---

## 🚧 Planejamento Futuro

### 🎯 Melhorias imediatas

* Organizar códigos (JS, Frontend)
* Organizar pastas e arquivos (Python, Backend)
* Filtro de dados
* !Modo mecânico (mobile)
* Logs estruturados (JSON/DB)

### 🚀 Funcionalidades avançadas

* !Modelo 3D do carro (Three.js)
* Gráfico de suspensão (simulação accZ)
* Detecção automática de falhas
* !Modo remoto (LoRa/GSM/VPS)
* Cronômetro + tempo por volta

---

## 👨‍💻 Desenvolvido por

Equipe Mangue Baja UFPE – 2025

