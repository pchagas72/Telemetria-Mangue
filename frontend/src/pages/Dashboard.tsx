import "./Dashboard.css";
import { ChartGrafico } from "../components/ChartGrafico";
import { Mapa } from "../components/Mapa";
import { Bateria } from "../components/Bateria";
import { Serial } from "../components/Serial";
import { useTelemetry } from "../hooks/useTelemetry";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const data = useTelemetry();

    const [timestamps, setTimestamps] = useState<number[]>([]);
    const [velocidades, setVelocidades] = useState<number[]>([]);
    const [rpms, setRpms] = useState<number[]>([]);
    const [temps_motor, setTemps_motor] = useState<number[]>([]);
    const [temps_cvt, setTemps_cvt] = useState<number[]>([]);
    const [aceleracoesX, setAceleracoesX] = useState<number[]>([]);
    const [aceleracoesY, setAceleracoesY] = useState<number[]>([]);
    const [aceleracoesZ, setAceleracoesZ] = useState<number[]>([]);
    const [caminho, setCaminho] = useState<[number, number][]>([]);

    useEffect(() => {
        if (data) {
            const timestamp = Date.now();
            if (typeof data.vel === "number") {
                setTimestamps((prev) => [...prev.slice(-99), timestamp]);
                setVelocidades((prev) => [...prev.slice(-99), data.vel]);
            }
            if (typeof data.rpm === "number") {
                setRpms((prev) => [...prev.slice(-99), data.rpm]);
            }
            if (typeof data.temp_motor === "number") {
                setTemps_motor((prev) => [...prev.slice(-99), data.temp_motor]);
            }
            if (typeof data.temp_cvt === "number") {
                setTemps_cvt((prev) => [...prev.slice(-99), data.temp_cvt]);
            }
            if (typeof data.accx === "number") {
                setAceleracoesX((prev) => [...prev.slice(-99), data.accx]);
            }
            if (typeof data.accy === "number") {
                setAceleracoesY((prev) => [...prev.slice(-99), data.accy]);
            }
            if (typeof data.accz === "number") {
                setAceleracoesZ((prev) => [...prev.slice(-99), data.accz]);
            }

            if (!isNaN(data.latitude) && !isNaN(data.longitude)) {
                const pos: [number, number] = [data.latitude, data.longitude];
                if (caminho.length === 0 || caminho.at(-1)?.toString() !== pos.toString()) {
                    setCaminho((prev) => [...prev, pos]);
                }
            }
        }
    }, [data]);

    return (
        <div className="dashboard">
            <div className="left_panel">
                <ChartGrafico
                    titulo="Velocidade"
                    timestamps={timestamps}
                    series={[
                        {
                            label: "Velocidade",
                            valores: velocidades,
                            cor: "#a6e3a1",
                        },
                    ]}
                />
                <ChartGrafico
                    titulo="RPM"
                    timestamps={timestamps}
                    series={[
                        {
                            label: "RPM",
                            valores: rpms,
                            cor: "#a6e3a1",
                        },
                    ]}
                />
                <ChartGrafico
                    titulo="Temperaturas (ºC)"
                    timestamps={timestamps}
                    series={[
                        {
                            label: "Temp. Motor",
                            valores: temps_motor,
                            cor: "#a6e3a1",
                        },
                        {
                            label: "Temp. CVT",
                            valores: temps_cvt,
                            cor: "#f9e2af",
                        },
                    ]}
                />
                <ChartGrafico
                    titulo="Acelerção XYZ"
                    timestamps={timestamps}
                    series={[
                        {
                            label: "accX",
                            valores: aceleracoesX,
                            cor: "#74c7ec",
                        },
                        {
                            label: "accY",
                            valores: aceleracoesY,
                            cor: "#f9e2af",
                        },
                        {
                            label: "accZ",
                            valores: aceleracoesZ,
                            cor: "#a6e3a1",
                        },
                    ]}
                />

            </div>

            <div className="right_panel">
                {data && <Mapa latitude={data.latitude} longitude={data.longitude} caminho={caminho} />}
                {data && <Serial data={data} />}
                {data && <Bateria soc={data.soc} tensao={data.volt} corrente={data.current} />}
            </div>
        </div>
    );
}

