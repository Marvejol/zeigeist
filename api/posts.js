import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovzrzmfunfpwljieqkrj.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const openaiKey = process.env.OPENAI_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
          //gotta fix this so it is less
            const { data, error } = await supabase.from('posts').select('*');
            if (error) throw error;
            res.status(200).json(data);
            console.log(openaiKey);
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