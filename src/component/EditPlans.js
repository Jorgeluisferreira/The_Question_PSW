import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans, editPlan, deletePlan } from "../store/plansReducer";

function EditPlans() {
  const dispatch = useDispatch();
  const { plans, PlanStatus, error } = useSelector((state) => state.plans);

  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({ name: "", itens: [], price: "" });

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  // Atualiza o formulário quando um plano é selecionado para edição
  useEffect(() => {
    if (editingPlan) {
      setFormData({
        name: editingPlan.name,
        itens: editingPlan.itens || [], // Garante que "itens" seja um array
        price: editingPlan.price
      });
    }
  }, [editingPlan]);

  const handleEditClick = (plan) => {
    setEditingPlan(plan);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este plano?")) {
      dispatch(deletePlan(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPlan) {
      dispatch(editPlan({ 
        id: editingPlan._id, 
        name: formData.name,
        itens: formData.itens, 
        price: formData.price
      }))
      .then(() => setEditingPlan(null)); // Sai do modo de edição apenas após o Redux atualizar
    }
  };

  return (
    <div className="container">
      <h2>Lista de Planos</h2>

      {PlanStatus === "loading" && <p>Carregando...</p>}
      {PlanStatus === "failed" && <p>Erro: {error}</p>}

      {/* Lista de Planos */}
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan._id}>
              <td>{plan.name}</td>
              <td>R$ {plan.price}</td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => handleEditClick(plan)}>
                  Editar
                </button>
                &nbsp;
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(plan._id)}>
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulário de Edição */}
      {editingPlan && (
        <div className="card p-3">
          <h4>Editar Plano</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label>Nome</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label>Preço</label>
              <input
                type="number"
                className="form-control"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label>Itens</label>
              <textarea
                className="form-control"
                value={formData.itens.join(", ")}
                onChange={(e) => setFormData({ ...formData, itens: e.target.value.split(",") })}
              />
              <small>Separe os itens por vírgula.</small>
            </div>
            <button type="submit" className="btn btn-success">Salvar</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingPlan(null)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default EditPlans;
