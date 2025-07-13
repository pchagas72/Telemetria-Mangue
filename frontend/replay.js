let dados = [], currentIndex = 0, intervalo;
let velocidadeChart, rpmChart, temperaturaChart, bateriaChart;
let map, marker, caminho = [], polyline;

const setupChart = (ctx, label, cores) => new Chart(ctx, {
    type: 'line',
    data: { labels: [], datasets: cores },
    options: {
        responsive: true,
        animation: false,
        scales: { x: { display: false }, y: { ticks: { color: '#cdd6f4' } } },
        plugins: {
            title: { display: true, text: label, color: '#cdd6f4', font: { size: 18 } },
            legend: { labels: { color: '#cdd6f4' } }
        }
    }
});

window.onload = () => {
    velocidadeChart = setupChart(document.getElementById('velocidade').getContext('2d'), 'Velocidade', [
        { label: 'Velocidade', data: [], borderColor: '#00ADB5', fill: false }
    ]);
    rpmChart = setupChart(document.getElementById('rpm').getContext('2d'), 'RPM', [
        { label: 'RPM', data: [], borderColor: '#ADB500', fill: false }
    ]);
    temperaturaChart = setupChart(document.getElementById('temperatura').getContext('2d'), 'Temperatura', [
        { label: 'Motor', data: [], borderColor: '#FF5733', fill: false },
        { label: 'Câmbio', data: [], borderColor: '#3375FF', fill: false }
    ]);
    bateriaChart = setupChart(document.getElementById('bateria').getContext('2d'), 'Bateria', [
        { label: 'SOC (%)', data: [], borderColor: '#00ff99', fill: false },
        { label: 'Tensão (V)', data: [], borderColor: '#00bfff', fill: false },
        { label: 'Corrente (mA)', data: [], borderColor: '#ff0066', fill: false }
    ]);
    map = L.map('map').setView([0, 0], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    marker = L.marker([0, 0]).addTo(map);
    polyline = L.polyline(caminho, { color: 'red' }).addTo(map);
};

document.getElementById('csvInput').addEventListener('change', e => {
    Papa.parse(e.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: results => { dados = results.data; resetarReplay(); }
    });
});

function iniciarReplay() {
    if (!dados.length) return;
    function tocarProximo() {
        if (currentIndex >= dados.length - 1) return;
        const atual = dados[currentIndex], proximo = dados[currentIndex + 1];
        const delay = new Date(proximo.timestamp) - new Date(atual.timestamp);
        atualizarGraficos(atual);
        atualizarBateriaUI(atual);
        atualizarMapa(atual.latitude, atual.longitude);
        document.getElementById("timestamp_display").innerText = atual.timestamp;
        currentIndex++;
        intervalo = setTimeout(tocarProximo, delay);
        atualizarProgresso();
    }
    tocarProximo();
}
function pausarReplay() { clearTimeout(intervalo); }
function resetarReplay() {
    clearInterval(intervalo);
    currentIndex = 0; caminho = []; polyline.setLatLngs([]);
    [velocidadeChart, rpmChart, temperaturaChart, bateriaChart].forEach(chart => {
        chart.data.labels = []; chart.data.datasets.forEach(ds => ds.data = []); chart.update();
    });
}
function atualizarGraficos(data) {
    velocidadeChart.data.labels.push("");
    velocidadeChart.data.datasets[0].data.push(parseFloat(data.vel));
    velocidadeChart.update();
    rpmChart.data.labels.push("");
    rpmChart.data.datasets[0].data.push(parseFloat(data.rpm));
    rpmChart.update();
    temperaturaChart.data.labels.push("");
    temperaturaChart.data.datasets[0].data.push(parseFloat(data.temp_motor));
    temperaturaChart.data.datasets[1].data.push(parseFloat(data.temp_cvt));
    temperaturaChart.update();
    bateriaChart.data.labels.push("");
    bateriaChart.data.datasets[0].data.push(parseFloat(data.soc));
    bateriaChart.data.datasets[1].data.push(parseFloat(data.volt));
    bateriaChart.data.datasets[2].data.push(parseFloat(data.current));
    bateriaChart.update();
}
function atualizarBateriaUI(data) {
    document.getElementById("bateria_soc").innerText = parseFloat(data.soc).toFixed(0);
    document.getElementById("bateria_tensao").innerText = parseFloat(data.volt).toFixed(2);
    document.getElementById("bateria_corrente").innerText = parseFloat(data.current).toFixed(0);
    const socBar = document.getElementById("soc_bar");
    socBar.style.width = `${data.soc}%`;
    socBar.style.backgroundColor = data.soc < 20 ? "#ff4444" : data.soc < 50 ? "#ffaa00" : "#00ff99";
}
function atualizarMapa(lat, lon) {
    if (!isNaN(lat) && !isNaN(lon)) {
        const novaPosicao = [parseFloat(lat), parseFloat(lon)];
        marker.setLatLng(novaPosicao);
        map.setView(novaPosicao, map.getZoom());
        caminho.push(novaPosicao);
        polyline.setLatLngs(caminho);
    }
}
function atualizarProgresso() {
    document.getElementById("replay_progress").value = Math.round((currentIndex / (dados.length - 1)) * 100);
}
document.getElementById("replay_progress").addEventListener("input", function() {
    const percent = this.value;
    currentIndex = Math.round((percent / 100) * (dados.length - 1));
    resetarGraficos();
    for (let i = 0; i < currentIndex; i++) {
        atualizarGraficos(dados[i]);
        atualizarBateriaUI(dados[i]);
        atualizarMapa(dados[i].latitude, dados[i].longitude);
    }
    document.getElementById("timestamp_display").innerText = dados[currentIndex].timestamp;
});
function resetarGraficos() {
    [velocidadeChart, rpmChart, temperaturaChart, bateriaChart].forEach(chart => {
        chart.data.labels = []; chart.data.datasets.forEach(ds => ds.data = []); chart.update();
    });
    caminho = []; polyline.setLatLngs([]);
}
async function enviarCSVparaPDF() {
    const input = document.getElementById("csvInput");
    if (!input.files.length) return alert("Selecione um CSV primeiro!");
    const formData = new FormData();
    formData.append("csv", input.files[0]);
    const res = await fetch(`${location.origin}/gerar_pdf`, { method: "POST", body: formData });
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "relatorio_sessao.pdf";
    link.click();
}
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/app/service-worker.js');

