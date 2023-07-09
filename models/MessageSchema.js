const mongoose = require("mongoose");
const { format } = require("date-fns");

const { Schema } = mongoose;

const messageSchema = new Schema({
  title: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now() },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "users", required: true },
});

messageSchema.virtual("date_formatted").get(function() {
  return format(this.timestamp, "dd/mm/yyyy H:mm");
});

module.exports = mongoose.model("messages", messageSchema);
