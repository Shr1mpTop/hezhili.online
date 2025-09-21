const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  excerpt: String,
  date: { type: Date, default: Date.now },
  tags: [String],
  likes: { type: Number, default: 0 },
  likedBy: [String] // IP addresses or user IDs
});

module.exports = mongoose.model('Post', PostSchema);