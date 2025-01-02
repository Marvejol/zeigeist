import fs from 'fs';
import path from 'path';

const postsFilePath = path.join(process.cwd(), 'posts.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));
    res.status(200).json(posts);
  } else if (req.method === 'POST') {
    const { post } = req.body;
    if (post) {
      const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));
      posts.push({ post });
      fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
      res.status(201).json({ message: 'Post added successfully!' });
    } else {
      res.status(400).json({ message: 'Invalid post data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}