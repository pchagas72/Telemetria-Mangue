# Mangue Baja - Sistema de Telemetria

Este é o sistema de telemetria e diagnóstico em tempo real utilizado pela equipe **Mangue Baja UFPE**. O projeto foi desenvolvido com foco em:

- Visualização em tempo real dos dados do carro
- Reproduções de sessões passadas (via CSV)
- Diagnóstico com exportação de relatórios em PDF
- Acesso multiplataforma (desktop e mobile)
- Modularidade e preparação para expansão (LoRa, Modo Pista)

---

## 🛠 Tecnologias principais

- **Backend:** FastAPI + WebSocket + aiomqtt + FPDF2 + Matplotlib
- **Frontend:** React + TypeScript + Vite + uPlot.js + Leaflet.js
- **Simulação:** Geração de dados realistas via Pandas
- **Compatibilidade:** PWA (modo offline), responsivo e mobile-first
- **Debug:** Comunicação Bluetooth (RFCOMM), com fallback simulado

---

## 📁 Estrutura do Repositório

```
/backend       → Código Python do servidor, simulação e geração de relatórios
/frontend      → Interface React + TS + Vite (dashboard, replay)
/scripts       → Scripts auxiliares (setup, bluetooth, build)
/docs          → Documentação técnica e funcional por módulo
```

---

## ✅ Status Atual

- ✅ Telemetria funcional em tempo real  
- ✅ Replay de sessões com barra de progresso e controle  
- ✅ Exportação de relatórios PDF com gráficos  
- ✅ Simulador completo com dados coerentes  
- ✅ Interface moderna com React e Vite  
- ✅ Responsivo para dispositivos móveis  
- ✅ Diagnóstico remoto via WebSocket (modo debug)  
- ✅ Download e exclusão segura de arquivos CSV  
- ✅ Comunicação cliente-servidor com `fetch`, `WebSocket` e `MQTT`  
- ✅ Context API e hooks para controle de replay

---

## 🔧 TODO

- Organizar repositório [X]  
- Fazer estudo dos limites atuais [X]  
  - Trocar Chart.js por uPlot.js [X]  
  - Utilizar MQTT no backend [X]  
  - Migrar frontend para React [X]  

- Implementar interface com React [X]  
  - Dashboard com gráficos em tempo real [X]  
  - Página de replay com barra de progresso [X]  
  - Download de CSV [X]  
  - Envio de comandos de debug [X]  
  - Roteamento entre páginas com React Router [X]
  - Melhorar interface para mobile [ ]

- Melhorar PDF gerado [ ]
- Estilização da interface (botões, layout, responsividade) [ ]  
- Modificar código da SCU [ ]  
- Testes finais com dados reais no carro [ ]  
- Escrita da documentação técnica (instalação, manutenção) [ ]

---

Feito por Pedro Chagas, membro da equipe Mangue Baja UFPE
=======
