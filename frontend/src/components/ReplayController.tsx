import { useReplayContext } from "../context/ReplayContext";
import { ExportarPDF } from "../components/ReplayActions.tsx"

export function ReplayController() {
    const {
        play,
        pause,
        reset,
        loadCSV,
        currentIndex,
        setCurrentIndex,
        dados,
        timestampAtual,
    } = useReplayContext();

    return (
        <div>
      <input id="csvInput" type="file" onChange={(e) => e.target.files && loadCSV(e.target.files[0])} />
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
      <button onClick={reset}>Reset</button>
      <ExportarPDF />
      <p>Timestamp atual: {timestampAtual}</p>
      <input
        type="range"
        value={currentIndex}
        max={dados.length - 1}
        onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
      />
    </div>
  );
}

