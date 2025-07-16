import { useCallback, useRef, useState } from "react";
import Papa from "papaparse";

interface DadoTelemetria {
  timestamp: string;
  vel: string;
  rpm: string;
  temp_motor: string;
  temp_cvt: string;
  soc: string;
  volt: string;
  current: string;
  latitude: string;
  longitude: string;
  [key: string]: string; // para permitir campos extras
}

export function useReplay() {
  const [dados, setDados] = useState<DadoTelemetria[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setProgress(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const pausar = useCallback(() => {
    setIsPlaying(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const iniciar = useCallback(() => {
    if (!dados.length || currentIndex >= dados.length - 1) return;
    setIsPlaying(true);

    const tocar = () => {
      const atual = dados[currentIndex];
      const proximo = dados[currentIndex + 1];

      const delay =
        new Date(proximo.timestamp).getTime() - new Date(atual.timestamp).getTime();

      setCurrentIndex((prev) => prev + 1);
      setProgress(((currentIndex + 1) / dados.length) * 100);

      if (currentIndex + 1 < dados.length - 1) {
        timeoutRef.current = window.setTimeout(tocar, delay);
      } else {
        setIsPlaying(false);
      }
    };

    tocar();
  }, [dados, currentIndex]);

  const carregarCSV = useCallback((file: File) => {
    Papa.parse<DadoTelemetria>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setDados(results.data);
        reset();
      },
    });
  }, [reset]);

  const irParaProgresso = useCallback((percent: number) => {
    const novoIndex = Math.round((percent / 100) * (dados.length - 1));
    setCurrentIndex(novoIndex);
    setProgress(percent);
  }, [dados]);

  const dadoAtual = dados[currentIndex];

  return {
    dados,
    dadoAtual,
    currentIndex,
    isPlaying,
    progress,
    iniciar,
    pausar,
    reset,
    carregarCSV,
    irParaProgresso,
  };
}
