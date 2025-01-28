import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlans } from "./store/plansReducer";

function UserList() {
  const dispatch = useDispatch();
   // Buscar planos do Redux Store
  const { plans, PlanStatus, error } = useSelector((state) => state.plans);
  useEffect(() => {
        if (PlanStatus === "idle") {
        dispatch(fetchPlans());
        }
  }, [PlanStatus, dispatch]);


  return (
    <div>
      <h2>Lista de Planos </h2>
      {PlanStatus === "loading" && <p>Carregando...</p>}
      {PlanStatus === "failed" && <p>Erro: {error}</p>}
      {PlanStatus === "succeeded" && (
        <ul>
          {plans.map((plan) => (
            <li id={plan._id}>{plan.name}</li>
          ))}
        </ul>
      )}
    
    </div>
  );
}

export default UserList;
