import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { createPlan } from "../store/plansReducer";

function CreatePlanScreen() {
  const [name, setName] = useState("");
  const [itens, setItens] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Converte a string dos itens em um array separado por vírgulas
    const itensArray = itens.split(",").map(item => item.trim()).filter(item => item);

    const planData = {
      name,
      itens: itensArray,
      price,
      image: image ? URL.createObjectURL(image) : "/images/default.png",
    };

    try {
      await dispatch(createPlan(planData));
      console.log("Plano salvo com sucesso!");
      setName("");
      setItens("");
      setPrice("");
      setImage(null);
    } catch (err) {
      console.error("Erro ao criar o plano:", err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Campo do nome do plano */}
      <Form.Group controlId="nome">
        <Form.Label>Nome do Plano</Form.Label>
        <Form.Control
          type="text"
          placeholder="Digite o nome do plano"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>

      {/* Campo de itens */}
      <Form.Group controlId="itens">
        <Form.Label>Itens do Plano (separados por vírgulas)</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ex: Item1, Item2, Item3"
          value={itens}
          onChange={(e) => setItens(e.target.value)}
          required
        />
      </Form.Group>

      {/* Campo do preço */}
      <Form.Group controlId="price">
        <Form.Label>Preço</Form.Label>
        <Form.Control
          placeholder="Preço"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </Form.Group>

      {/* Campo para adicionar a imagem */}
      <Form.Group controlId="image">
        <Form.Label>Imagem</Form.Label>
        <Form.Control
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
        />
      </Form.Group>

      {/* Botão de envio */}
      <Button type="submit" className="mt-3">
        Criar Plano
      </Button>
    </Form>
  );
}

export default CreatePlanScreen;
