# Mangue Baja - Sistema de Telemetria

Este é o sistema de telemetria e diagnóstico em tempo real utilizado pela equipe **Mangue Baja UFPE**. O projeto foi desenvolvido com foco em:

- Visualização em tempo real dos dados do carro
- Reproduções de sessões passadas (CSV)
- Diagnóstico com exportação de relatórios
- Acesso por computador ou dispositivo móvel
- Modularidade e preparação para expansão (LoRa, modo pista)

## Tecnologias principais

- **Backend:** FastAPI + WebSocket + FPDF2 + Matplotlib + aiomqtt
- **Frontend:** React + TypeScript + Vite + uPlot.js + Leaflet.js
- **Simulação:** Geração de dados realistas via Pandas
- **Compatibilidade:** PWA (modo offline), responsivo e mobile-first
- **Modo Debug:** Comunicação via Bluetooth RFCOMM (ou simulado)

## Estrutura do repositório

```
/backend       → Código Python do servidor, simulação e PDF
/frontend      → HTML, JS, CSS e arquivos estáticos da interface
/scripts       → Scripts auxiliares (bluetooth, build, etc)
/docs          → Documentação detalhada por funcionalidade
```

## Status atual

✅ Telemetria funcional em tempo real  
✅ Replay de sessões com barra de progresso  
✅ Exportação de PDF com gráficos e estatísticas  
✅ Modo simulado com dados coerentes  
✅ Layout adaptado para mobile  
✅ Diagnóstico modular via WebSocket  
✅ Conexão MQTT para recebimento de dados  
✅ Interface em React com componentes modernos  
✅ Download e exclusão segura de CSV  
✅ Comunicação entre cliente-servidor via fetch/WebSocket

---

## TODO

- Organizar repositório [✅]  
- Fazer estudo dos limites atuais [✅]  
  - Trocar chart.js por uplot.js [✅]  
  - Utilizar MQTT no backend [✅]  
  - Trocar front para React [✅]  

- Implementar interface em React [✅]  
  - Implementar dashboard [✅]  
  - Implementar replay [✅]  
  - Implementar download de CSV [✅]  
  - Implementar debugger [✅]  
  - Implementar router [🔲]  

- Estilizar componentes (botões, layout, responsividade) [🔲]  
- Testes finais no ambiente real (carro) [🔲]  
- Documentação de desenvolvimento (README, setup) [🔲]
