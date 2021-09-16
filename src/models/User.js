const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            min: 3,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 100,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 30,
        },
    },
    {
        timestamps: true,
    }
);

const UserModel = model("User", UserSchema);
module.exports = { UserModel };
