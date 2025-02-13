import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchFeedbacks, updateFeedback, deleteFeedback } from "./store/feedbackReducer"; 
import './FeedbackScreen.css';

const FeedbackScreen = () => {
  const dispatch = useDispatch();
  const { feedbacks, feedbackStatus, feedbackError } = useSelector((state) => state.feedbacks);
  const currentUser = useSelector((state) => state.users.currentUser);
  const [newFeedback, setNewFeedback] = useState("");

  useEffect(() => {
    if (feedbackStatus === "idle") {
      dispatch(fetchFeedbacks());
    }
  }, [dispatch, feedbackStatus]);

  const handleSubmitFeedback = async () => {
    if (newFeedback.trim() === "") {
      alert("Por favor, escreva um feedback antes de enviar.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:3004/feedback", {
        nome: currentUser.nome,       
        mensagem: newFeedback, 
        createdAt: new Date().toISOString(),
      });

      setNewFeedback("");    
      alert("Obrigado pelo feedback!");
      dispatch(fetchFeedbacks()); 
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este feedback?")) {
      try {
        await dispatch(deleteFeedback(id));
        alert("Feedback excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir feedback:", error);
      }
    }
  };

  const handleEditFeedback = async (id, newMessage) => {
    if (newMessage.trim() === "") {
      alert("A mensagem não pode estar vazia!");
      return;
    }

    try {
      await dispatch(updateFeedback({ id, mensagem: newMessage }));
      alert("Feedback atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar feedback:", error);
    }
  };

  return (
    <div className="feedback-container">
      <h1>Deixe seu Feedback</h1>

      <textarea
        className="feedback-textarea"
        placeholder="Escreva seu feedback aqui..."
        value={newFeedback} 
        onChange={(e) => setNewFeedback(e.target.value)}
      />

      <button className="feedback-button" onClick={handleSubmitFeedback}>
        Enviar Feedback
      </button>

      <h2>Seus Feedbacks</h2>
      {feedbackStatus === "loading" && <p>Carregando feedbacks...</p>}
      {feedbackStatus === "failed" && <p>Erro ao carregar feedbacks: {feedbackError}</p>}
      {feedbacks.length === 0 ? (
        <p>Nenhum feedback encontrado.</p>
      ) : (
        <div className="feedback-list">
          {feedbacks
            .filter(feedback => feedback.nome === currentUser.nome) // Exibir apenas os feedbacks do usuário logado
            .map((feedback) => (
              <div key={feedback._id} className="feedback-item">
                <h4>{feedback.nome}</h4>
                <p>{feedback.mensagem}</p>
                <div>
                  <button onClick={() => handleEditFeedback(feedback._id, prompt("Edite seu feedback:", feedback.mensagem))}>
                    Editar
                  </button>
                  <button onClick={() => handleDeleteFeedback(feedback._id)}>
                    Excluir
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackScreen;
