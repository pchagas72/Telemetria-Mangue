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
- ✅ Database com SQLite

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
  - Adicionar página de sessões antigas [ ]

- Implementar database [X]
- Melhorar PDF gerado [ ]
- Modificar código da SCU [ ]
- Testes finais com dados reais no carro [ ]  
- Estilização da interface (botões, layout, responsividade) [ ]  
- Escrita da documentação técnica (instalação, manutenção) [ ]

---

# Inspiração Tecnológica – Formula SAE / WEC aplicável ao Baja-SAE

Este documento apresenta uma matriz comparativa entre tecnologias avançadas utilizadas nas competições Formula SAE e WEC, e sua aplicabilidade no contexto da equipe **Mangue Baja UFPE**.

| Tecnologia / Conceito                           | Aplicação em FSAE / WEC                                                                 | Possível Adaptação na Mangue Baja UFPE                                           |
|--------------------------------------------------|------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| 🔴 **Telemetria em tempo real**                  | Comunicação contínua carro ↔ box via rádio ou LTE.                                      | Já implementado com MQTT + WebSocket. Pode evoluir para transmissão LoRa.       |
| 🧠 **Processamento local (Edge Computing)**       | Uso de microcontroladores para filtragem e compressão de dados a bordo.                | ESP32 ou Raspberry Pi para tratar dados antes de enviar.                         |
| 🪪 **Identificação da sessão / piloto**           | Cada piloto e configuração possuem uma tag para análise posterior.                    | Criar botão de início/fim de sessão com nome do piloto, tempo e anotação.        |
| 🔥 **Monitoramento térmico**                     | Sensores de temperatura em motor, freios, diferencial.                                 | Aplicável em motor, CVT, baterias e controlador.                                |
| ⚙️ **Mapeamento de uso da marcha CVT**           | Correlação entre RPM e velocidade para avaliar eficiência do conjunto CVT.            | Já implementado nos gráficos do relatório PDF. Pode ser melhorado.               |
| 🌡️ **Visualização térmica (mapas de calor)**     | Mapas de dissipação de calor ao longo da pista.                                         | Plotagens básicas em PDF ou replay; futuramente via matplotlib + heatmaps.       |
| 📍 **Rastreamento GPS + mapa da pista**          | Trajeto visual com dados como velocidade e frenagem.                                   | Já implementado com Leaflet.js. Pode evoluir com mais métricas visuais.          |
| ⚠️ **Alertas de falha (thresholds)**             | Dashboard indica em tempo real: "risco de falha", "temperatura crítica", etc.         | Pode ser implementado no back ou client com base em ranges definidos.            |
| 📊 **Repositório de sessões com replay**         | Histórico navegável com dashboards comparativos.                                       | Implementado. Pode ser expandido com múltiplas sessões e comparação.             |
| 🏁 **Comparação de pilotos/configurações**        | Avaliação estatística de quem anda melhor com qual setup.                             | Possível com base nos dados salvos em SQLite por sessão/piloto.                  |
| 🔄 **Sincronização com sensores analógicos**     | Leitura simultânea de sensores analógicos com timestamp preciso.                      | Possível com ADCs no ESP32 e sincronização com timestamp de sessão.              |
| 🔋 **Estimativa de consumo energético**           | Calculo do gasto energético ao longo da corrida.                                       | Já coletando corrente e tensão → pode calcular consumo e prever autonomia.       |
| 📦 **Canal de comunicação unificado (CAN)**      | Padrão industrial de comunicação entre sensores e módulos.                             | Possível com ESP32 + módulo CAN. Alternativa viável para escalabilidade.         |
| 💽 **Banco de dados relacional**                 | PostgreSQL / InfluxDB para consulta, análise e exportação.                            | Já usando SQLite, ideal para embedded. Futuro: replicar para nuvem ou exportar.  |
| 🧪 **Análise preditiva (ML básico)**              | Detectar padrões de falha antes de ocorrerem com aprendizado de máquina.              | Futuro: aplicar regressão, SVM ou clustering para anomalias em RPM/temperatura.  |
| 🧰 **Calibração e setup assistido**              | Comparar configurações de suspensão, pneus, CVT etc.                                   | Criar dashboard para análise de impacto de cada variável.                        |
| 🖥️ **Painel de controle com filtros**             | Dashboard onde engenheiros podem filtrar variáveis específicas durante o replay.       | Em desenvolvimento. Pode ser integrado com sliders e seleção de métricas.        |
| 🕒 **Timestamp de alta precisão (RTC / NTP)**     | Dados marcados com tempo exato para sincronização cruzada.                            | Pode usar RTC (Real Time Clock) ou sincronização com servidor NTP.               |
| 🛰️ **Backup na nuvem / logs externos**            | Toda sessão é automaticamente salva e pode ser revisitada remotamente.                | Futuro: Enviar logs para um serviço como Firebase, Supabase ou servidor privado. |

---

## 💡 Outras ideias aplicáveis

- ✅ *Controle de qualidade de sensores:* leitura redundante e verificação cruzada.
- 📈 *Dashboard administrativo da equipe:* sessões, consumo, falhas registradas.
- 🧾 *Histórico de manutenção digitalizado:* associar falhas com logs anteriores.
- 🚥 *“Modo corrida” com interface reduzida:* dados apenas essenciais na tela.


Feito por Pedro Chagas, membro da equipe Mangue Baja UFPE
=======
