import "./Dashboard.css";
import { ChartVelocidade } from "../components/ChartVelocidade";
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
        <ChartVelocidade
          titulo="Velocidade (km/h)"
          valores={velocidades}
          timestamps={timestamps}
        />
        <ChartVelocidade
          titulo="RPM"
          valores={rpms}
          timestamps={timestamps}
          cor="#f97316"
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

