const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(express.json());  // To handle JSON request bodies
app.use(cors());  // Enable CORS for cross-origin requests

const postsFilePath = './posts.json';

// Get all posts
app.get('/api/posts', (req, res) => {
  fs.readFile(postsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read posts' });
    }
    res.json(JSON.parse(data));
  });
});

// Submit a new post
app.post('/api/posts', (req, res) => {
  const newPost = req.body.post;
  
  if (!newPost) {
    return res.status(400).json({ error: 'Post content is required' });
  }

  fs.readFile(postsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read posts' });
    }

    const posts = JSON.parse(data);
    posts.push({ post: newPost, timestamp: new Date().toISOString() });

    fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save post' });
      }
      res.status(201).json({ message: 'Post submitted successfully' });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});