interface BateriaProps {
  soc: number;
  tensao: number;
  corrente: number;
}

export function Bateria({ soc, tensao, corrente }: BateriaProps) {
  const getBarColor = () => {
    if (soc > 50) return "#4caf50";       // verde
    if (soc > 20) return "#fdd835";       // amarelo
    return "#e53935";                     // vermelho
  };

  return (
    <div className="bateria_container">
      <div className="soc_bar_container">
        <div
          className="soc_bar"
          style={{
            width: `${soc}%`,
            backgroundColor: getBarColor(),
          }}
        />
      </div>
      <p>SOC: <span id="bateria_soc">{soc}%</span></p>
      <p>Tensão: <span id="bateria_tensao">{tensao.toFixed(2)}</span> V</p>
      <p>Corrente: <span id="bateria_corrente">{corrente.toFixed(2)}</span> mA</p>
    </div>
  );
}

