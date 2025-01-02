import { Client } from 'pg';

const client = new Client({
  connectionString: 'https://ovzrzmfunfpwljieqkrj.supabase.co', // Replace with your connection string
});

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const result = await client.query('SELECT * FROM posts');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch posts' });
    } finally {
      await client.end();
    }
  } else if (req.method === 'POST') {
    const { post } = req.body;
    try {
      await client.connect();
      await client.query('INSERT INTO posts(post) VALUES($1)', [post]);
      res.status(200).json({ message: 'Post added' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add post' });
    } finally {
      await client.end();
    }
  }
}

export default handler;