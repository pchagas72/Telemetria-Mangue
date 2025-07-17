export function ExportarPDF() {
  const exportarPDF = async () => {
    const input = document.getElementById("csvInput") as HTMLInputElement;
    if (!input || !input.files || !input.files.length) return alert("Selecione um CSV!");

    const formData = new FormData();
    formData.append("csv", input.files[0]);

    const res = await fetch("http://localhost:8000/gerar_pdf", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "relatorio_sessao.pdf";
    link.click();
  };

  return <button onClick={exportarPDF}>Exportar PDF</button>;
}
