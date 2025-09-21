const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  postId: mongoose.Schema.Types.ObjectId,
  author: String,
  content: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);