import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovzrzmfunfpwljieqkrj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92enJ6bWZ1bmZwd2xqaWVxa3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MzAyNDMsImV4cCI6MjA1MTQwNjI0M30.6xwb-GYkEO4hACs2V8myTU_icqDD-1XraCTdwdsVAWc';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // POST - Add a new post
    const { post } = req.body;
    if (!post) {
      return res.status(400).json({ error: 'Post content is missing' });
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ post }]);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ message: 'Post added successfully', data });
    } catch (err) {
      return res.status(500).json({ error: 'Server error', details: err.message });
    }
  } else if (req.method === 'GET') {
    // GET - Retrieve posts
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*');

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ posts: data });
    } catch (err) {
      return res.status(500).json({ error: 'Server error', details: err.message });
    }
  } else {
    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  }
}