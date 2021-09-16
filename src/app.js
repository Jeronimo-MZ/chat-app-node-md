const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./database");

const { router } = require("./routes");

const app = express();

app.use((req, res, next) => {
    const { method, url } = req;

    console.log(`[${method}] ${url}`);
    next();
});

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(router);

module.exports = { app };
