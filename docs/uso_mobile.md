# 📱 Uso Mobile (Interface via Celular)

Este sistema foi desenvolvido com suporte nativo para dispositivos móveis (smartphones e tablets), mesmo sem acesso à internet externa.

## 🌐 Acesso por rede local

1. Conecte seu celular à mesma rede Wi-Fi do computador servidor.
2. No computador, descubra seu IP local:
   ```bash
   ip addr | grep inet  # Linux
   ```
   Exemplo: `192.168.1.42`

3. No navegador do celular, acesse:
   ```
   http://192.168.1.42:8000/app
   ```

## 📲 Instalar como aplicativo (PWA)

1. Acesse via navegador moderno (Chrome, Edge)
2. Um botão de “Instalar” será sugerido
3. Isso cria um atalho na home do celular

## 🔁 Funcionalidade offline

Graças ao `service-worker.js`, a interface pode continuar funcionando com cache mesmo se perder conexão — útil durante testes em campo.