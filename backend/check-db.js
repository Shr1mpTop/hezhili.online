const mongoose = require('mongoose');
const Post = require('./models/Post');
const fs = require('fs');

const connectDB = require('./database-connect');

const checkDB = async () => {
  await connectDB();
  try {
    const posts = await Post.find({});
    console.log('Posts in database:');
    console.log('Number of posts:', posts.length);
    
    // Write to file to check encoding
    fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2), 'utf8');
    console.log('Posts written to posts.json');
    
    posts.forEach((post, index) => {
      console.log(`Post ${index + 1}:`);
      console.log('Title length:', post.title.length);
      console.log('Content length:', post.content.length);
      console.log('---');
    });
  } catch (err) {
    console.error('Error querying posts:', err);
  } finally {
    mongoose.connection.close();
  }
};

checkDB();