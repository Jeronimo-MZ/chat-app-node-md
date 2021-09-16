const { Router } = require("express");
const { UserModel } = require("../models/User.js");
const { generateToken, decodeToken } = require("../utils/jwt.js");
const mongoose = require("mongoose");
const userRouter = Router();

userRouter.get("/users", async (request, response) => {
    const { authorization } = request.headers;

    if (!authorization) {
        return response.status(401).send("Unauthorized");
    }

    const user_id = await decodeToken(authorization);

    if (!user_id) return response.status(401).send("Unauthorized");

    const users = await UserModel.find();

    return response.json({
        users: users.map((user) => ({ ...user._doc, password: undefined })),
    });
});

userRouter.get("/users/me", async (request, response) => {
    const { authorization } = request.headers;

    if (!authorization) {
        return response.status(403).send("Access Denied");
    }

    const data = await decodeToken(authorization);

    if (!data) return response.status(403).send("Access Denied");
    const { id } = data;
    const user = await UserModel.findById(id);

    if (!user) {
        return response.status(403).send("Access Denied");
    }

    return response.json({
        user: { ...user._doc, password: undefined },
    });
});

userRouter.post("/signup", async (request, response) => {
    const requiredFields = ["username", "email", "password"];
    for (let field of requiredFields) {
        if (!request.body[field]) {
            return response
                .status(400)
                .json({ error: "Missing param: " + field });
        }
    }

    const { username, email, password } = request.body;

    if (password.length < 6)
        return response
            .status(400)
            .json({ error: "password must have at least 6 chars" });

    const user = await UserModel.create({ username, email, password });
    await user.save();

    return response.json({
        user: { ...user._doc, password: undefined },
        token: await generateToken(user._doc._id),
    });
});

userRouter.post("/login", async (request, response) => {
    const requiredFields = ["username", "password"];

    for (let field of requiredFields) {
        if (!request.body[field]) {
            return response
                .status(400)
                .json({ error: "Missing param: " + field });
        }
    }

    const { username, password } = request.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
        return response.status(403).json({ error: "Credenciais inválidas" });
    }

    if (user.password != password) {
        return response.status(403).json({ error: "Credenciais inválidas" });
    }
    return response.json({
        user: { ...user._doc, password: undefined },
        token: await generateToken(user._doc._id),
    });
});

module.exports = { userRouter };
