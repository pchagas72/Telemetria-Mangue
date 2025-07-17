import { BotaoTeste } from "../components/BotaoTeste.tsx"

export function DashboardActions() {
  const exportarCSV = async () => {
    const res = await fetch("http://localhost:8000/download_csv");
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dados.csv";
    link.click();
  };

  const deletarRun = async () => {
    if (!confirm("Tem certeza que deseja deletar a sessão atual?")) return;
    const res = await fetch("http://localhost:8000/deletar_run", { method: "DELETE" });
    alert(res.ok ? "Arquivo deletado com sucesso!" : "Erro ao deletar.");
  };

  const executarDebug = async () => {
    const cmd = prompt("Digite o comando de debug", "MD");
    if (!cmd) return;
    const res = await fetch("http://localhost:8000/debug", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cmd }),
    });
    if (!res.ok) return alert("Erro ao enviar comando");
    const data = await res.json();
    console.log("Resposta:", data);
  };

  return (
    <div className="dashboard-actions">
      <button onClick={exportarCSV}>Exportar CSV</button>
      <button onClick={deletarRun}>Deletar CSV</button>
      <button onClick={executarDebug}>Executar Debug</button>
      <BotaoTeste/>
    </div>
  );
}

