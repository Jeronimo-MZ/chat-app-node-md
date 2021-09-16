const mongoose = require("mongoose");

mongoose.connect(
    String(process.env.MONGO_URL),
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (error) => {
        if (error) {
            console.error(error);
        } else {
            console.log("Connected to MongoDb");
        }
    }
);
