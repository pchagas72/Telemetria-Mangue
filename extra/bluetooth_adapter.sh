#!/bin/bash

# Verifica permissões
if [[ $EUID -ne 0 ]]; then
    echo "⚠️  Este script precisa ser executado como root (use sudo)"
    exit 1
fi

echo "📦 Instalando pacotes necessários (se ainda não instalados)..."
pacman -Sy --needed bluez bluez-utils bluez-deprecated-tools rfkill || {
    echo "❌ Erro ao instalar pacotes"
    exit 1
}

echo "✅ Pacotes prontos"

echo "🔧 Habilitando e iniciando o serviço bluetooth..."
systemctl enable --now bluetooth

echo "🔓 Desbloqueando adaptador com rfkill (se necessário)..."
rfkill unblock bluetooth

echo "🌀 Iniciando bluetoothctl..."
bluetoothctl <<EOF
power on
agent on
EOF

echo ""
echo "🔍 Escaneando por dispositivos Bluetooth..."
bluetoothctl --timeout 10 scan on

echo ""
echo "📋 Últimos dispositivos detectados:"
bluetoothctl devices | tail -n 10

echo ""
read -p "Digite o MAC do dispositivo do carro (ex: 98:D3:31:F7:12:34): " mac

echo ""
echo "🔐 Emparelhando e confiando em $mac..."
bluetoothctl <<EOF
pair $mac
trust $mac
connect $mac
EOF

echo ""
echo "📡 Criando interface serial /dev/rfcomm0..."
rfcomm release 0 2>/dev/null  # Libera se já estava em uso
rfcomm bind /dev/rfcomm0 $mac

if [ -e /dev/rfcomm0 ]; then
    echo "✅ Interface criada com sucesso: /dev/rfcomm0"
    echo "Você pode agora usar isso no seu script Python."
else
    echo "❌ Algo deu errado. Verifique se o dispositivo suporta RFCOMM e tente novamente."
fi

