# 💻 Uso Local da Interface de Telemetria

## 📦 Instalação

```bash
git clone ...
cd Telemetria
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 🚀 Rodar o servidor

```bash
cd backend
uvicorn main:app --reload
```

## 🌐 Interface

- `http://localhost:8000/app` → Modo tempo real
- `http://localhost:8000/replay` → Modo replay

## 🧪 Modo simulado

Por padrão, o sistema inicia simulando uma sessão. Você verá:

- Gráficos de velocidade, RPM, temperatura, SOC
- Diagnóstico automático
- Dados armazenados em `telemetria.csv`