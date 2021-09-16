const { Router } = require("express");
const mongoose = require("mongoose");
const { ChatMessageModel } = require("../models/ChatMessage.js");
const { decodeToken } = require("../utils/jwt.js");

const chatRouter = Router();

chatRouter.post("/chat/messages", async (request, response) => {
    const { authorization } = request.headers;

    if (!authorization) {
        return response.status(401).send("Unauthorized");
    }

    if (!request.body.content) {
        return response.status(400).json({ error: "Missing param: content" });
    }

    const { content } = request.body;

    const data = await decodeToken(authorization);

    if (!data) return response.status(401).send("Unauthorized");
    const { id } = data;
    const chatMessage = await ChatMessageModel.create({
        content,
        author: mongoose.Types.ObjectId(id),
    });
    await chatMessage.save();

    const responseMessage = await chatMessage.populate("author", [
        "username",
        "email",
    ]);

    // objecto io adicionado no arquivo 'socket.js'
    request.app.io
        .to("main_room")
        .emit("new_message", { message: responseMessage });

    return response.json({ message: responseMessage });
});

chatRouter.get("/chat/messages", async (request, response) => {
    const { authorization } = request.headers;

    if (!authorization) {
        return response.status(401).send("Unauthorized");
    }

    const user_id = await decodeToken(authorization);

    if (!user_id) return response.status(401).send("Unauthorized");

    const chatMessages = await ChatMessageModel.find().populate("author", [
        "username",
        "email",
    ]);
    response.json({ messages: chatMessages });
});

module.exports = { chatRouter };
