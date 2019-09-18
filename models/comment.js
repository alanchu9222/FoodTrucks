const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  text: String,
  date: Date,
  dateString: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("Comment", commentSchema);
