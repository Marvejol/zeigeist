import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_SUPABASE_URL].supabase.co:5432/postgres', // Sostituisci con la tua stringa di connessione completa
});

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const result = await client.query('SELECT * FROM posts'); // Query per ottenere i post
      console.log('Dati restituiti dal database:', result.rows); // Log dei dati per debug
      res.status(200).json(result.rows); // Ritorna i post come JSON
    } catch (err) {
      console.error('Errore durante il recupero dei post:', err); // Log dell'errore
      res.status(500).json({ error: 'Failed to fetch posts' });
    } finally {
      await client.end(); // Chiudi la connessione al database
    }
  } else if (req.method === 'POST') {
    const { post } = req.body; // Ottieni il post dal corpo della richiesta
    if (!post) {
      res.status(400).json({ error: 'Il campo "post" è obbligatorio' });
      return;
    }

    try {
      await client.connect();
      await client.query('INSERT INTO posts(post) VALUES($1)', [post]); // Inserisci il nuovo post nel database
      console.log('Nuovo post aggiunto:', post); // Log del post aggiunto
      res.status(200).json({ message: 'Post added' }); // Rispondi con un messaggio di successo
    } catch (err) {
      console.error('Errore durante l\'inserimento del post:', err); // Log dell'errore
      res.status(500).json({ error: 'Failed to add post' });
    } finally {
      await client.end(); // Chiudi la connessione al database
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' }); // Rispondi con un errore per metodi non supportati
  }
}

export default handler;