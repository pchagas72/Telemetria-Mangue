import { ChangeEvent } from "react";
import { useReplay } from "../hooks/useReplay";

export function ReplayController() {
  const {
    carregarCSV,
    iniciar,
    pausar,
    reset,
    irParaProgresso,
    isPlaying,
    progress,
    dadoAtual,
  } = useReplay();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      carregarCSV(e.target.files[0]);
    }
  };

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    irParaProgresso(Number(e.target.value));
  };

  return (
    <div className="replay-controller" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2>Replay de Sessão</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={iniciar} disabled={isPlaying}>Reproduzir</button>
        <button onClick={pausar} disabled={!isPlaying}>Pausar</button>
        <button onClick={reset}>Resetar</button>
      </div>

      <label>
        Timestamp atual:
        <span style={{ marginLeft: "0.5rem" }}>{dadoAtual?.timestamp || "--"}</span>
      </label>

      <input
        type="range"
        min={0}
        max={100}
        value={progress}
        onChange={handleSliderChange}
      />
    </div>
  );
}
