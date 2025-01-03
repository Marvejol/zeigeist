import { createClient } from '@supabase/supabase-js';

// Use the correct URL
const supabaseUrl = 'https://ovzrzmfunfpwljieqkrj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92enJ6bWZ1bmZwd2xqaWVxa3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MzAyNDMsImV4cCI6MjA1MTQwNjI0M30.6xwb-GYkEO4hACs2V8myTU_icqDD-1XraCTdwdsVAWc';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { post } = req.body;

    if (!post) {
      return res.status(400).json({ error: 'Post content is missing' });
    }

    try {
      const { data, error } = await supabase
        .from('posts') // Ensure your table is called 'posts'
        .insert([{ post }]);

      if (error) throw error;

      res.status(200).json({ message: 'Post added', data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'A server error occurred', details: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}