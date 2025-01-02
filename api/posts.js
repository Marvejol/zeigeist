import { Client } from 'pg';

// Usa la connessione del database da variabili di ambiente di Vercel
const client = new Client({
  connectionString: process.env.SUPABASE_CONNECTION_STRING, // Assicurati che questa variabile di ambiente sia configurata su Vercel
});

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const result = await client.query('SELECT * FROM posts'); // Query per ottenere i post
      res.status(200).json(result.rows); // Ritorna i post come JSON
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch posts' });
    } finally {
      await client.end(); // Chiudi la connessione al database
    }
  } else if (req.method === 'POST') {
    const { post } = req.body; // Ottieni il post dal corpo della richiesta
    try {
      await client.connect();
      await client.query('INSERT INTO posts(post) VALUES($1)', [post]); // Inserisci il nuovo post nel database
      res.status(200).json({ message: 'Post added' }); // Rispondi con un messaggio di successo
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add post' });
    } finally {
      await client.end(); // Chiudi la connessione al database
    }
  }
}

export default handler;