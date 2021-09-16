const { decodeToken } = require("./utils/jwt");

const { app } = require("./app");
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    socket.on("joinChat", (token) => {
        const user_id = decodeToken(token);
        if (!user_id) socket.disconnect();

        console.log(socket.id, "joined");

        socket.join("main_room");
    });
    console.log(socket.id, "connected");
});

app.io = io;

module.exports = { app: server };
