import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import RegisterPage from "./RegisterPage";
import Teste from "./Teste";
import UserPage from "./UserPage";



function App() {
  return (
    <Router>
      <Routes>
          <Route index element={<HomePage />} />
          <Route path="loginpage" element={<LoginPage />} />
          <Route path="cadastro" element={<RegisterPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="teste" element={<Teste />} />
      </Routes>
    </Router>
  );
}

export default App;
