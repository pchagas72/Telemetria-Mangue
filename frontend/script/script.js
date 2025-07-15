// script.js otimizado com uPlot.js e atualização de gráficos a cada 250ms com alta performance

const protocolo = location.protocol === "https:" ? "wss" : "ws";
const host = location.hostname;
const ws = new WebSocket(`${protocolo}://${host}:8000/ws/telemetry`);
const renderWindowSize = 30; // Gráficos


let velocidadeChart, rpmChart, aceleracaoChart, temperaturaChart;
let map, marker, caminho = [], polyline;
let filaPacotes = [];

const bufferSize = 50;
const dataVel = [[], []];
const dataRpm = [[], []];
const dataAcc = [[], [], [], []];
const dataTemp = [[], [], []];

window.onload = () => {
    velocidadeChart = criarGraficoUPlot("chart_velocidade", "Velocidade (km/h)", "#00ADB5");
    rpmChart = criarGraficoUPlot("chart_rpm", "RPM", "#ADB500");
    aceleracaoChart = criarGraficoUPlotMulti("chart_aceleracao", "Aceleração", ["X", "Y", "Z"], ["#00ADB5", "#ADB500", "#B500AD"]);
    temperaturaChart = criarGraficoUPlotMulti("chart_temperatura", "Temperatura", ["Motor", "Câmbio"], ["#00ADB5", "#ADB500"]);

    map = L.map('map').setView([0, 0], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([0, 0]).addTo(map);
    polyline = L.polyline(caminho, { color: 'red' }).addTo(map);

    aplicarPreferenciasGraficos();
    requestAnimationFrame(loop);
};

function criarGraficoUPlot(id, label, color) {
    return new uPlot({
        title: label,
        width: 600,
        height: 200,
        series: [ {}, { label, stroke: color } ],
        axes: [ {}, { stroke: "#cdd6f4" } ],
        scales: { x: { time: false }, y: { auto: true } },
    }, [[], []], document.getElementById(id));
}

function criarGraficoUPlotMulti(id, titulo, labels, cores) {
    const series = [{}, ...labels.map((l, i) => ({ label: l, stroke: cores[i] }))];
    return new uPlot({
        title: titulo,
        width: 600,
        height: 200,
        series,
        axes: [ {}, { stroke: "#cdd6f4" } ],
        scales: { x: { time: false }, y: { auto: true } },
    }, Array(series.length).fill([]).map(() => []), document.getElementById(id));
}

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    filaPacotes.push(data);
};

function atualizarGraficos(data) {
    const now = Date.now();
    updateBuffer(dataVel, now, data.vel);
    updateBuffer(dataRpm, now, data.rpm);
    updateMultiBuffer(dataAcc, now, [data.accx, data.accy, data.accz]);
    updateMultiBuffer(dataTemp, now, [data.temp_motor, data.temp_cvt]);
    const start = Math.max(0, dataVel[0].length - renderWindowSize);
    velocidadeChart.setData([
        dataVel[0].slice(start),
        dataVel[1].slice(start)
    ]);

    rpmChart.setData([
        dataRpm[0].slice(start),
        dataRpm[1].slice(start)
    ]);

    aceleracaoChart.setData([
        dataAcc[0].slice(start),
        dataAcc[1].slice(start),
        dataAcc[2].slice(start),
        dataAcc[3].slice(start)
    ]);

    temperaturaChart.setData([
        dataTemp[0].slice(start),
        dataTemp[1].slice(start),
        dataTemp[2].slice(start),
    ]);

    //velocidadeChart.setData(dataVel);
    //rpmChart.setData(dataRpm);
    //aceleracaoChart.setData(dataAcc);
    //temperaturaChart.setData(dataTemp);

    updateBateriaUI(data.soc, data.volt, data.current);
    updateDiagnostico(data);
    updateMapa(data.latitude, data.longitude);

    document.getElementById("status_mobile").innerText = `SoC: ${data.soc}% | Motor:${data.temp_motor}°C | Vel: ${data.vel} km/h`;
}

function updateBuffer(buffer, x, y) {
    buffer[0].push(x);
    buffer[1].push(y);
    if (buffer[0].length > bufferSize) {
        buffer[0].shift();
        buffer[1].shift();
    }
}

function updateMultiBuffer(buffer, x, ys) {
    if (buffer.length !== ys.length + 1) return;
    buffer[0].push(x);
    ys.forEach((y, i) => buffer[i + 1].push(y));
    if (buffer[0].length > bufferSize) {
        buffer.forEach(arr => arr.shift());
    }
}

function updateDiagnostico(data){
    const log = document.getElementById("debug_log");
    if (data.temp_motor > 90) log.value += `⚠️ Temperatura elevada: ${data.temp_motor}°C\n`;
    if (data.soc < 20) log.value += `⚠️ SOC baixo: ${data.soc}%\n`;
    if (data.current > 400) log.value += `⚠️ Corrente alta: ${data.current} mA\n`;
    if (data.volt < 10.5 || data.volt > 12.5) log.value += `⚠️ Tensão fora do ideal: ${data.volt} V\n`;
    log.scrollTop = log.scrollHeight;
}

const debugWs = new WebSocket("ws://localhost:8000/ws/debug");

debugWs.onmessage = (event) => {
    const log = document.getElementById("debug_log");
    log.value += event.data + "\n";
    log.scrollTop = log.scrollHeight; // Scroll automático
};

function executarDebug() {
    fetch("/debug", {
        method: "POST"
    });
}

async function deletarRun() {
    const confirmacao = confirm("Tem certeza que deseja deletar a sessão atual?");
    if (!confirmacao) return;

    const res = await fetch("http://localhost:8000/deletar_run", {
        method: "DELETE"
    });

    if (res.ok) {
        alert("Arquivo de sessão deletado.");
    } else {
        alert("Erro ao deletar arquivo.");
    }
}

function updateMapa(lat, lon) {
    if (!isNaN(lat) && !isNaN(lon)) {
        const novaPosicao = [lat, lon];
        marker.setLatLng(novaPosicao);
        map.setView(novaPosicao, map.getZoom());
        caminho.push(novaPosicao);
        polyline.setLatLngs(caminho);
    }
}

function updateBateriaUI(soc, volt, current) {
    document.getElementById("bateria_soc").innerText = soc.toFixed(0);
    document.getElementById("bateria_tensao").innerText = volt.toFixed(2);
    document.getElementById("bateria_corrente").innerText = current.toFixed(0);

    const socBar = document.getElementById("soc_bar");
    socBar.style.width = `${soc}%`;
    socBar.style.backgroundColor = soc < 20 ? "#ff4444" : soc < 50 ? "#ffaa00" : "#00ff99";
}

function aplicarPreferenciasGraficos() {
    const ids = ["velocidade", "rpm", "aceleracao", "temperatura"];
    ids.forEach(id => {
        const estado = localStorage.getItem(`grafico_${id}`);
        const div = document.getElementById("chart_" + id);
        const checkbox = document.querySelector(`input[type='checkbox'][onchange*='${id}']`);
        if (estado === "hidden") {
            div.parentElement.style.display = "none";
            if (checkbox) checkbox.checked = false;
        } else {
            div.parentElement.style.display = "block";
            if (checkbox) checkbox.checked = true;
        }
    });
}

function toggleGrafico(id) {
    const key = `grafico_${id}`;
    const div = document.getElementById("chart_" + id);
    const visible = div.parentElement.style.display !== "none";
    div.parentElement.style.display = visible ? "none" : "block";
    localStorage.setItem(key, visible ? "hidden" : "visible");
}

// Atualização com requestAnimationFrame a cada 250ms
let ultimaAtualizacao = 0;
function loop() {
    const agora = Date.now();
    if (filaPacotes.length > 0 && agora - ultimaAtualizacao > 250) {
        const ultimo = filaPacotes.at(-1);
        atualizarGraficos(ultimo);
        filaPacotes = [];
        ultimaAtualizacao = agora;
    }
    requestAnimationFrame(loop);
}
