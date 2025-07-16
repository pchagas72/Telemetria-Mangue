interface BateriaProps {
    soc : number;
    tensao : number;
    corrente : number;
}

export function Bateria({ soc, tensao, corrente }: BateriaProps){
    return(
        <div>
            <div className="soc_bar_container"/>
            <p>SOC: <span id="bateria_soc">{soc}%</span></p>
            <p>Tensão: <span id="bateria_tensao">{tensao}</span> V</p>
            <p>Corrente: <span id="bateria_corrente">{corrente}</span> mA</p>
        </div>
    );

}
