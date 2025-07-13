# 🧪 Simulação de Sessão (Modo Offline)

Você pode testar toda a interface sem estar com o carro ligado.

## ✅ Como funciona

- O backend gera dados simulados com base em curvas realistas
- A cada 500ms, novos dados são enviados via WebSocket
- Esses dados são gravados em `telemetria.csv`

## 🔄 Reset da simulação

Acesse:
```
http://localhost:8000/deletar_run
```

Isso apaga os dados da simulação anterior e começa uma nova sessão.

## 📤 Exportar a simulação

Após gerar dados suficientes, você pode:
- Visualizar o replay
- Exportar como PDF
- Compartilhar o CSV com a equipe