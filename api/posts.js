import { Client } from 'pg';

// Connessione al database tramite URL di Supabase
const client = new Client({
  connectionString: process.env.SUPABASE_URL,  // Usa la variabile d'ambiente
  ssl: { rejectUnauthorized: false },  // Se necessario per connessione sicura
});

async function handler(req, res) {
  // Evita di riutilizzare la connessione più volte
  let connection;

  try {
    if (req.method === 'GET') {
      connection = await client.connect();
      const result = await connection.query('SELECT * FROM posts');
      res.status(200).json(result.rows);  // Risponde con i post
    } else if (req.method === 'POST') {
      const { post } = req.body;
      if (!post) {
        return res.status(400).json({ error: 'Post content is missing' });
      }
      connection = await client.connect();
      await connection.query('INSERT INTO posts(post) VALUES($1)', [post]);  // Inserisce il nuovo post
      res.status(200).json({ message: 'Post added successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  } finally {
    if (connection) {
      connection.release();  // Rilascia la connessione per evitare errori
    }
  }
}

export default handler;