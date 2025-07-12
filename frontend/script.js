const ws = new WebSocket("ws://localhost:8000/ws/telemetry");

let velocidadeChart, rpmChart, aceleracaoChart;

let map;
let marker;            // Marcador do carro no mapa
let caminho = [];      // Lista de posições anteriores
let polyline;          // A linha do caminho

window.onload = () => {
    const ctxVel = document.getElementById('velocidade').getContext('2d');
    const ctxRpm = document.getElementById('rpm').getContext('2d');
    const ctxAcel = document.getElementById('aceleracao').getContext('2d');
    const ctxTemp = document.getElementById('temperatura').getContext('2d');
    //const ctxBateria = document.getElementById('bateria').getContext('2d');

    velocidadeChart = new Chart(ctxVel, { type: 'line', data: setupData("Velocidade"), options: setupOptions("Velocidade") });
    rpmChart = new Chart(ctxRpm, { type: 'line', data: setupData("RPM"), options: setupOptions("RPM") });
    aceleracaoChart = new Chart(ctxAcel, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: "Aceleração X", data: [], borderColor: "#00ADB5", fill: false },
                { label: "Aceleração Y", data: [], borderColor: "#ADB500", fill: false },
                { label: "Aceleração Z", data: [], borderColor: "#B500AD", fill: false }
            ]
        },
        options: setupOptions("Aceleração")
    });
    temperaturaChart = new Chart(ctxTemp, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: "Motor", data: [], borderColor: "#00ADB5", fill: false },
                { label: "Câmbio", data: [], borderColor: "#ADB500", fill: false },
            ]
        },
        options: setupOptions("Temperatura")
    });
    //bateriaChart = new Chart(ctxBateria, {
        //type: 'line',
        //data: {
            //labels: [],
            //datasets: [
                //{ label: "SOC (%)", data: [], borderColor: "#00ff99", fill: false },
                //{ label: "Tensão (V)", data: [], borderColor: "#00bfff", fill: false },
                //{ label: "Corrente (mA)", data: [], borderColor: "#ff0066", fill: false }
            //]
        //},
        //options: setupOptions("Status da Bateria")
    //});

    // Início do mapa

    map = L.map('map').setView([0, 0], 13); // Começa em [lat, long] genéricos
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Adiciona um marcador inicial
    marker = L.marker([0, 0]).addTo(map);
    polyline = L.polyline(caminho, { color: 'red' }).addTo(map);

};

function setupData(label) {
    return {
        labels: [],
        datasets: [{ label, data: [] }]
    };
}

function setupOptions(titulo) {
    return {
        responsive: true,
        animation: false,
        scales: {
            x: { display: false },
            y: { ticks: { color: '#cdd6f4' } }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#cdd6f4',
                    font: {
                        size: 16,
                        family: 'Arial'
                    }
                }
            },
            title: {
                display: true,
                text: titulo,
                color: '#cdd6f4',
                font: {
                    size: 20
                },
                align: 'center'
            }
        }
    };
}

ws.onmessage = (event) => { // Quando receber dados
    const data = JSON.parse(event.data);

    updateChart(velocidadeChart, data.vel);
    updateChart(rpmChart, data.rpm);
    updateAceleracaoChart(aceleracaoChart, data.accx, data.accy, data.accz);
    updateTemperaturaChart(temperaturaChart, data.temp_motor, data.temp_cvt);
    updateBateriaUI(data.soc, data.volt, data.current);

    updateDiagnostico(data);
    updateMapa(data.latitude, data.longitude);
};

function updateChart(chart, value) {
    if (Array.isArray(value)) {
        chart.data.labels.push("");
        chart.data.datasets[0].data.push(value[0]);
    } else {
        chart.data.labels.push("");
        chart.data.datasets[0].data.push(value);
    }

    if (chart.data.labels.length > 50) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    chart.update();
}

function updateAceleracaoChart(chart, accX, accY, accZ) {
    chart.data.labels.push("");

    chart.data.datasets[0].data.push(accX);
    chart.data.datasets[1].data.push(accY);
    chart.data.datasets[2].data.push(accZ);

    if (chart.data.labels.length > 50) {
        chart.data.labels.shift();
        chart.data.datasets.forEach(ds => ds.data.shift());
    }

    chart.update();
}

function updateTemperaturaChart(chart, temp_motor, temp_cvt) {
    chart.data.labels.push("");

    chart.data.datasets[0].data.push(temp_motor);
    chart.data.datasets[1].data.push(temp_cvt);

    if (chart.data.labels.length > 50) {
        chart.data.labels.shift();
        chart.data.datasets.forEach(ds => ds.data.shift());
    }

    chart.update();
}

function updateBateriaChart(chart, soc, volt, current) {
    chart.data.labels.push("");

    chart.data.datasets[0].data.push(soc);
    chart.data.datasets[1].data.push(volt);
    chart.data.datasets[2].data.push(current);

    if (chart.data.labels.length > 50) {
        chart.data.labels.shift();
        chart.data.datasets.forEach(ds => ds.data.shift());
    }

    chart.update();
}

function updateDiagnostico(data){
    const log = document.getElementById("debug_log");

    if (data.temp_motor > 90) {
        log.value += "⚠️ Temperatura do motor elevada: " + data.temp_motor + "°C\n";
    }

    if (data.soc < 20) {
        log.value += "⚠️ SOC da bateria baixo: " + data.soc + "%\n";
    }

    if (data.current > 400) {
        log.value += "⚠️ Corrente muito alta: " + data.current + " mA\n";
    }

    if (data.volt < 10.5 || data.volt > 12.5) {
        log.value += "⚠️ Tensão fora do ideal: " + data.volt + " V\n";
    }

    log.scrollTop = log.scrollHeight; // Scroll automático
}


function updateMapa(lat, lon) {
    if (!isNaN(lat) && !isNaN(lon)) {
        const novaPosicao = [lat, lon];
        
        // Atualiza posição do marcador
        marker.setLatLng(novaPosicao);

        // Move a visualização do mapa (mantendo zoom atual)
        map.setView(novaPosicao, map.getZoom());

        // Adiciona nova posição ao caminho
        caminho.push(novaPosicao);

        // Atualiza a linha (polyline) com a nova lista de posições
        polyline.setLatLngs(caminho);
    }
}

// Debugger

const debugWs = new WebSocket("ws://localhost:8000/ws/debug");

debugWs.onmessage = (event) => {
    const log = document.getElementById("debug_log");
    log.value += event.data + "\n";
    log.scrollTop = log.scrollHeight; // Scroll automático
};

function executarDebug() {
    fetch("http://localhost:8000/debug", {
        method: "POST"
    });
}

function updateBateriaUI(soc, volt, current) {
    document.getElementById("bateria_soc").innerText = soc.toFixed(0);
    document.getElementById("bateria_tensao").innerText = volt.toFixed(2);
    document.getElementById("bateria_corrente").innerText = current.toFixed(0);

    const socBar = document.getElementById("soc_bar");
    socBar.style.width = `${soc}%`;

    // Alterar cor da barra conforme o nível de SOC
    if (soc < 20) {
        socBar.style.backgroundColor = "#ff4444"; // vermelho
    } else if (soc < 50) {
        socBar.style.backgroundColor = "#ffaa00"; // laranja
    } else {
        socBar.style.backgroundColor = "#00ff99"; // verde
    }
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

