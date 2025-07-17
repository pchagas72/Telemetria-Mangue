import React, { createContext, useContext, useState, useEffect } from "react";
import Papa from "papaparse";
import type TelemetriaData from "../types/TelemetriaData"; // seu tipo de dados

interface ReplayContextType {
  dados: TelemetriaData[];
  currentIndex: number;
  play: () => void;
  pause: () => void;
  reset: () => void;
  loadCSV: (file: File) => void;
  timestampAtual: string;
}

const ReplayContext = createContext<ReplayContextType | null>(null);

export const useReplayContext = () => {
  const context = useContext(ReplayContext);
  if (!context) throw new Error("useReplayContext must be used within a ReplayProvider");
  return context;
};

export const ReplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dados, setDados] = useState<TelemetriaData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalo, setIntervalo] = useState<NodeJS.Timeout | null>(null);
  const [timestampAtual, setTimestampAtual] = useState("");

  const loadCSV = (file: File) => {
    Papa.parse<TelemetriaData>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,  
      complete: (results) => {
        setDados(results.data);
        reset();
      },
    });
  };

  const play = () => {
    if (!dados.length) return;
    function tocarProximo() {
      if (currentIndex >= dados.length - 1) return;
      const atual = dados[currentIndex];
      const proximo = dados[currentIndex + 1];
      const delay = new Date(proximo.timestamp).getTime() - new Date(atual.timestamp).getTime();
      setCurrentIndex((i) => i + 1);
      setTimestampAtual(atual.timestamp);
      const id = setTimeout(tocarProximo, delay);
      setIntervalo(id);
    }
    tocarProximo();
  };

  const pause = () => {
    if (intervalo) clearTimeout(intervalo);
    setIntervalo(null);
  };

  const reset = () => {
    pause();
    setCurrentIndex(0);
  };

  return (
    <ReplayContext.Provider value={{
            dados,
            currentIndex,
            play,
            pause,
            reset,
            setCurrentIndex,
            loadCSV,
            timestampAtual }}>
      {children}
    </ReplayContext.Provider>
  );
};

