import { Client } from 'pg';

// Configura il client PostgreSQL direttamente con la stringa di connessione
const client = new Client({
  connectionString: 'postgresql://USER:PASSWORD@db.ovzrzmfunfpwljieqkrj.supabase.co:5432/YOUR_DATABASE', // Sostituisci USER, PASSWORD, e YOUR_DATABASE con i tuoi valori corretti
});

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const result = await client.query('SELECT * FROM posts'); // Query per ottenere i post
      res.status(200).json(result.rows); // Ritorna i post come JSON
    } catch (err) {
      console.error('Errore durante il recupero dei post:', err);
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
      console.error('Errore durante l\'aggiunta del post:', err);
      res.status(500).json({ error: 'Failed to add post' });
    } finally {
      await client.end(); // Chiudi la connessione al database
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' }); // Rispondi con un errore per metodi non supportati
  }
}

export default handler;