import { createClient } from '@supabase/supabase-js';

// Use the correct URL
const supabaseUrl = 'https://ovzrzmfunfpwljieqkrj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92enJ6bWZ1bmZwd2xqaWVxa3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MzAyNDMsImV4cCI6MjA1MTQwNjI0M30.6xwb-GYkEO4hACs2V8myTU_icqDD-1XraCTdwdsVAWc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function handler(req, res) {
    const startTime = Date.now(); // Record the start time
    
    if (req.method === 'POST') {
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
  
        const endTime = Date.now(); // Record the end time
        const timeTaken = endTime - startTime; // Calculate the time taken
        console.log(`Time taken to insert post: ${timeTaken}ms`); // Log the time taken
  
        return res.status(200).json({ message: 'Post added', data });
      } catch (err) {
        return res.status(500).json({ error: 'Error adding post', details: err.message });
      }
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  }
  
  export default handler;