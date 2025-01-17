import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovzrzmfunfpwljieqkrj.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);



export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const limit = 10; // Number of posts per batch
            const offset = req.query.offset || 0; // Offset for pagination (defaults to 0)
    
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false }) // Order by creation date
                .range(offset, offset + limit - 1); // Fetch a specific range of posts
    
            if (error) throw error;
    
            res.status(200).json(data); // Return the current batch of posts
        } catch (err) {
            res.status(500).json({ error: 'A server error occurred', details: err.message });
        }
    } else if (req.method === 'POST') {
        try {
            const { post } = req.body;
            if (!post) throw new Error('Post content is missing');

            // Anonymize the post using OpenAI
            const anonymizedPost = await anonymizePost(post);
            
            const { data, error } = await supabase.from('posts').insert([{ post: anonymizedPost }]);
            if (error) throw error;
            res.status(200).json({ message: 'Post added', data });
        } catch (err) {
            res.status(500).json({ error: 'A server error occurred', details: err.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}



async function anonymizePost(post) {
    const prompt = `Rewrite the following post by replacing each person’s name with a randomly selected name from a list of the top 25 most common names for men and women. Ensure a diverse selection by using different names for each individual and balancing the replacements evenly across male and female names. Avoid repeating names within the same post. Here’s the post: "${post}"`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: "user", content: prompt }
                ],
                max_tokens: 500,
                temperature: 0.6
            })
        });

        const data = await response.json();

        // Check if the response contains the expected structure
        if (data && data.choices && data.choices.length > 0 && data.choices[0].message) {
            return data.choices[0].message.content.trim();
        } else {
            console.error('Unexpected API response structure:', data);
            throw new Error('Invalid API response structure');
        }
    } catch (error) {
        console.error('Error anonymizing post:', error);
        return post; // Return original post in case of error
    }
}