const { sign, verify } = require("jsonwebtoken");

async function generateToken(user_id) {
    return await sign({ id: user_id }, process.env.SECRET, {
        expiresIn: "1d",
    });
}

async function decodeToken(token) {
    try {
        return await verify(token, process.env.SECRET);
    } catch (error) {
        return null;
    }
}

module.exports = { generateToken, decodeToken };
