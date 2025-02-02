
// Rota para atualizar a assinatura e associar caixas ao usuário
router.put("/users/:userId/subscribe", async (req, res) => {
    try {
        const { userId } = req.params;
        const { assinaturaId, boxes } = req.body; // `assinaturaId` é o plano, `boxes` é um array de IDs das caixas

        // Verifica se os dados necessários foram enviados
        if (!assinaturaId || !boxes || !Array.isArray(boxes)) {
            return res.status(400).json({ message: "Dados inválidos. Envie um 'assinaturaId' e um array de 'boxes'." });
        }

        // Atualiza o usuário no banco de dados
        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            {
                assinatura: assinaturaId,
                boxes: boxes
            },
            { new: true } // Retorna o usuário atualizado
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.json({ message: "Assinatura realizada com sucesso!", user: updatedUser });

    } catch (error) {
        console.error("Erro ao atualizar assinatura:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

const express = require("express");
const router = express.Router();
const Users = require("../models/users");

