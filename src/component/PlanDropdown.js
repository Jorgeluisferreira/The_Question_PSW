import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans } from "../store/plansReducer"; // Certifique-se de que está importando a ação corretamente

function PlanoDropdown({ selectedPlan, setSelectedPlan, isEditing }) {
  const dispatch = useDispatch();
  const { plans, PlanStatus, error } = useSelector((state) => state.plans);

  useEffect(() => {
    dispatch(fetchPlans()); // Buscar planos ao carregar o componente
  }, [dispatch]);

  const handleSelectChange = (e) => {
    setSelectedPlan(e.target.value); // Atualiza o plano selecionado
  };

  return (
    <div className="container">
      {PlanStatus === "loading" && <p>Carregando...</p>}
      {PlanStatus === "failed" && <p>Erro: {error}</p>}

      {/* Dropdown de planos */}
      <select
        className="form-select"
        value={selectedPlan || ""}
        onChange={handleSelectChange}
        disabled={isEditing}
        style={{
            backgroundColor: isEditing ? "#e0e0e0" : "white", // Cinza apenas quando desabilitado
            cursor: isEditing ? "default" : "pointer", // Remove "not-allowed" quando ativo
            color: isEditing ? "#757575" : "black", // Deixa o texto mais "apagado" quando desativado
          }}
      >
        <option value="">Selecione um plano</option>
        {plans.map((plan) => (
          <option key={plan._id} value={plan._id}>
            {plan.name} - R$ {plan.price}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PlanoDropdown;
