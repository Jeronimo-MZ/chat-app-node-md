const { app } = require("./socket");
const PORT = 3333;

app.listen(PORT, () => console.log("server started at port:", PORT));
