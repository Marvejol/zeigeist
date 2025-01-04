import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovzrzmfunfpwljieqkrj.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92enJ6bWZ1bmZwd2xqaWVxa3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MzAyNDMsImV4cCI6MjA1MTQwNjI0M30.6xwb-GYkEO4hACs2V8myTU_icqDD-1XraCTdwdsVAWc';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase.from('posts').select('*');
            if (error) throw error;
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'A server error occurred', details: err.message });
        }
    } else if (req.method === 'POST') {
        try {
            const { post } = req.body;
            if (!post) throw new Error('Post content is missing');

            const { data, error } = await supabase.from('posts').insert([{ post }]);
            if (error) throw error;
            res.status(200).json({ message: 'Post added', data });
        } catch (err) {
            res.status(500).json({ error: 'A server error occurred', details: err.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}