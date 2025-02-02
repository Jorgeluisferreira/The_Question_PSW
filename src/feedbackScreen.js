import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchFeedbacks } from "./store/feedbackReducer"; 
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
      // Ajuste a URL para seu servidor Express com MongoDB
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
    </div>
  );
};

export default FeedbackScreen;
