import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  },
  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },
  content: {
    type: String,
    required: function() {
      return this.messageType === "text";
    }
  },
  fileUrl: {
    type: String,
    required: function() {
      return this.messageType === "file";
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Prevent the model from being overwritten if it already exists
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
