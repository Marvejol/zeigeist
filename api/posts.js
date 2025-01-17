import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovzrzmfunfpwljieqkrj.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;
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
    const prompt = `Anonymize the following text by changing names, locations, and any data that would make someone not anonymous, apart from age and sex:\n\n${post}`;

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
                    { role: "system", content: "You are an anonymization assistant. Remove any names, locations, and identifiable data from the following text." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 500,
                temperature: 0.3
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