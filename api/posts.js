import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://postgres:2!etLCrp.eHwwHt@db.ovzrzmfunfpwljieqkrj.supabase.co:5432/postgres',
});

async function handler(req, res) {
  try {
    await client.connect();
    if (req.method === 'GET') {
      const result = await client.query('SELECT * FROM posts');
      res.status(200).json(result.rows); // Assicurati che venga restituito un array
    } else if (req.method === 'POST') {
      const { post } = req.body;
      if (!post) throw new Error('Post content is missing');
      await client.query('INSERT INTO posts(post) VALUES($1)', [post]);
      res.status(200).json({ message: 'Post added' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'A server error occurred', details: err.message });
  } finally {
    await client.end();
  }
}

export default handler;