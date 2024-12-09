import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchFeedbacks } from "./store/feedbackReducer"; 
import './FeedbackScreen.css';

const FeedbackScreen = () => {
  const dispatch = useDispatch();
  const { feedbacks, feedbackStatus, feedbackError } = useSelector((state) => state.feedbacks);

  const [newFeedback, setNewFeedback] = useState("");
  const [userName, setUserName] = useState(""); 

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

    if (userName.trim() === "") {
      alert("Por favor, informe seu nome.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/feedbacks", {
        nome: userName,       
        mensagem: newFeedback, 
        createdAt: new Date().toISOString(),
      });

      setNewFeedback(""); 
      setUserName("");   

      dispatch(fetchFeedbacks()); 
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
    }
  };

  return (
    <div className="feedback-container">
      <h1>Deixe seu Feedback</h1>

      <input
        type="text"
        placeholder="Digite seu nome"
        value={userName}
        onChange={(e) => setUserName(e.target.value)} 
      />

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
