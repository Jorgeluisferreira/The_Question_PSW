const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Carregar variáveis de ambiente
dotenv.config();

// Importar os modelos
const Plan = require("./models/plans");
const Box = require("./models/boxes");
const User = require("./models/users");
const Suggestion = require("./models/sugestion");
const Feedback = require("./models/feedback");

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("🔥 Conectado ao MongoDB. Populando dados...");

    // Remover dados antigos (opcional)
    await Plan.deleteMany({});
    await Box.deleteMany({});
    await User.deleteMany({});
    await Suggestion.deleteMany({});
    await Feedback.deleteMany({});

    // Criar planos
    const plans = await Plan.insertMany([
      { name: "Plano Básico", itens: ["Item1", "Item2"], price: 29.90, boxes: [] },
      { name: "Plano Premium", itens: ["Item1", "Item2", "Item3"], price: 59.90, boxes: [] },
    ]);

    // Criar caixas e associar aos planos
    const boxes = await Box.insertMany([
      { nome: "Box Geek", tema: "Filmes", itens: ["Camiseta", "Chaveiro"], plan: plans[0]._id },
      { nome: "Box Otaku", tema: "Anime", itens: ["Pôster", "Adesivos"], plan: plans[1]._id },
    ]);

    // Atualizar os planos com as caixas associadas
    await Promise.all(
      plans.map((plan, index) => {
        plan.boxes.push(boxes[index]._id);
        return plan.save();
      })
    );

    // Criar usuários
    await User.insertMany([
      { nome: "Admin", email: "admin@example.com", senha: "123456", tipo: "admin", isActive: true },
      { nome: "Usuário", email: "user@example.com", senha: "123456", tipo: "user", isActive: true },
    ]);

    // Criar sugestões e feedbacks
    await Suggestion.insertMany([
      { nome: "Usuário1", mensagem: "Seria legal ter mais opções de planos!" },
    ]);
    await Feedback.insertMany([
      { nome: "Usuário2", mensagem: "Adorei a box, excelente qualidade!" },
    ]);

    console.log("✅ Banco de dados populado com sucesso!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });
