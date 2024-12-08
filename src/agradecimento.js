import React from "react";
import { useNavigate } from "react-router-dom";

function Agradecimento() {
  const navigate = useNavigate();

  const handleVoltar = () => {
    // Redireciona o usuário de volta para a página inicial ou qualquer outra página desejada
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h1>Obrigado pela sua assinatura!</h1>
      <p>Seu pagamento foi processado com sucesso.</p>
      <button onClick={handleVoltar} style={styles.button}>
        Voltar para a página inicial
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f8ff",
    textAlign: "center",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Agradecimento;
