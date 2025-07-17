import { useEffect, useState } from "react";
import type { TelemetriaData } from "../types/TelemetriaData.ts"


export function useTelemetry() {
    const [data, setData] = useState<TelemetriaData | null>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/telemetry");

        ws.onmessage = (event) => {
            const parsed = JSON.parse(event.data);
            setData(parsed);
        };

        return () => ws.close();
    }, []);

    return data;
}
