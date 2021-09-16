const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            min: 1,
        },
    },
    {
        timestamps: true,
    }
);

const ChatMessageModel = model("ChatMessage", UserSchema);
module.exports = { ChatMessageModel };
