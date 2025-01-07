import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { createBox } from "../store/boxesReducer";

function CreateBoxScreen({ onCancel }) {
    const [nome, setNome] = useState("");
    const [itens, setItens] = useState("");
    const [tema, setTema] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
    const dispatch = useDispatch();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
        
      setErrorMessage("");

      if (!nome || !itens || !tema) {
        setErrorMessage("Todos os campos são obrigatórios.");
        return;  // Impede o envio se algum campo estiver vazio
      }
      // Converte a string de itens em um array
      const itensArray = itens.split(",").map((item) => item.trim()).filter((item) => item);
  
      const boxData = {
        nome,
        itens: itensArray,
        tema,
      };
  
      try {
        await dispatch(createBox(boxData)); // Envia a ação para salvar a box
        console.log("Box salva com sucesso!");

        setSuccessMessage("Box adicionada com sucesso!");

        setNome("");
        setItens("");
        setTema("");

        setTimeout(() => {
            setSuccessMessage("");
          }, 5000);

      } catch (err) {
        console.error("Erro ao criar a box:", err);
      }
    };
  
    return (
      <Form onSubmit={handleSubmit}>
        {/* Campo do nome da box */}
        <Form.Group controlId="nome">
          <Form.Label>Nome da Box</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o nome da box"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </Form.Group>
  
        {/* Campo de itens */}
        <Form.Group controlId="itens">
          <Form.Label>Itens da Box (separados por vírgulas)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ex: Item1, Item2, Item3"
            value={itens}
            onChange={(e) => setItens(e.target.value)}
            required
          />
        </Form.Group>
  
        {/* Campo do tema */}
        <Form.Group controlId="tema">
          <Form.Label>Tema da Box</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o tema da box"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            required
          />
        </Form.Group>
        
        {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
        </div>
      )}

        {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      )}

        {/* Botões de Salvar e Cancelar */}
        <div className="mt-3 d-flex justify-content-between">
          <Button type="submit">Salvar</Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </Form>
    );
  }
  
  export default CreateBoxScreen;