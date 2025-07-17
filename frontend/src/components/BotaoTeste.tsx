// src/components/BotaoTeste.tsx
export function BotaoTeste() {
  const enviarSinal = async () => {
    try {
      const res = await fetch("http://localhost:8000/sinal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mensagem: "teste do frontend" })
      });

      const data = await res.json();
      console.log("Resposta do servidor:", data);
    } catch (err) {
      console.error("Erro ao enviar sinal:", err);
    }
  };

  return <button onClick={enviarSinal}>Enviar Sinal</button>;
}

