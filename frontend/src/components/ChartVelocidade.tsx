import { useEffect, useRef } from "react";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";

interface ChartProps {
    titulo: string;
    valores: number[];
    timestamps: number[];
    cor?: string;
}

export function ChartVelocidade({ titulo, valores, timestamps, cor = "#00ADB5" }: ChartProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    const uplotRef = useRef<uPlot | null>(null);

    useEffect(() => {
        if (!chartRef.current || uplotRef.current) return;

        // Evita criar multiplos charts
        if (uplotRef.current) {
            uplotRef.current.setData([timestamps, valores]);
            return;
        }

        const opts: uPlot.Options = {
            title: titulo,
            width: chartRef.current.clientWidth,
            height: 200,
            series: [
                {},
                {
                    label: titulo,
                    stroke: cor,
                },
            ],
            axes: [
                {},
                {
                    stroke: "#cdd6f4",
                },
            ],
        };
        uplotRef.current = new uPlot(opts, [timestamps, valores], chartRef.current);

        const resize = () => {
            uplotRef.current?.setSize({
                width: chartRef.current!.clientWidth,
                height: 200,
            });
        };

        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
            uplotRef.current?.destroy();
            uplotRef.current = null;
        };
    }, []); // 🔒 só cria uma vez

    useEffect(() => {
        uplotRef.current?.setData([timestamps, valores]);
    }, [timestamps, valores]); // 🔁 atualiza sem recriar

    return (
        <div
            ref={chartRef}
            className="grafico_velocidade"
            style={{ height: "200px", overflow: "hidden" }}
        />
    );

}
