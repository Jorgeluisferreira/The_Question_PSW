const express = require("express");
const router = express.Router();
const Subscription = require("../models/subscritpion");

// Criar uma nova assinatura
router.post("/", async (req, res) => {
    try {
        
        const { userId, planId } = req.body;

        if (!userId || !planId) {
            return res.status(400).json({ error: "Usuário e plano são obrigatórios" });
        }

        const newSubscription = new Subscription({
            userId,
            planId,
            startDate: new Date(),
        });

        await newSubscription.save();
        res.status(201).json(newSubscription);
    } catch (error) {
        console.error("Erro ao criar assinatura:", error);
        res.status(500).json({ error: "Erro no servidor" });
    }
});

module.exports = router;
