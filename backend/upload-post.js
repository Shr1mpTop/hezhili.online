const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import Post model
const Post = require('./models/Post');
const connectDB = require('./database-connect');

async function parseMD(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Simple frontmatter parsing (between ---)
  let frontmatter = {};
  let bodyStart = 0;

  if (lines[0].trim() === '---') {
    let endIndex = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        endIndex = i;
        break;
      }
      const [key, ...valueParts] = lines[i].split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        if (key.trim() === 'tags') {
          frontmatter.tags = value.split(',').map(tag => tag.trim());
        } else {
          frontmatter[key.trim()] = value;
        }
      }
    }
    bodyStart = endIndex + 1;
  }

  // Extract title from first # heading if not in frontmatter
  let title = frontmatter.title;
  if (!title) {
    for (let i = bodyStart; i < lines.length; i++) {
      if (lines[i].startsWith('# ')) {
        title = lines[i].substring(2).trim();
        break;
      }
    }
  }

  // Body content
  const body = lines.slice(bodyStart).join('\n').trim();

  // Generate excerpt if not provided
  let excerpt = frontmatter.excerpt;
  if (!excerpt) {
    // Remove markdown headers and take first 200 chars
    const cleanBody = body.replace(/^#+\s.*$/gm, '').trim();
    excerpt = cleanBody.substring(0, 200) + (cleanBody.length > 200 ? '...' : '');
  }

  return {
    title,
    content: body,
    excerpt,
    tags: frontmatter.tags || [],
    date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000) // UTC+8
  };
}

async function uploadPost(filePath) {
  await connectDB();

  try {
    const postData = await parseMD(filePath);

    const post = new Post(postData);
    await post.save();

    console.log('Post uploaded successfully:', post._id);
    console.log('Title:', post.title);
  } catch (error) {
    console.error('Error uploading post:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Check if file path is provided
const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node upload-post.js <path-to-md-file>');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error('File does not exist:', filePath);
  process.exit(1);
}

uploadPost(filePath);