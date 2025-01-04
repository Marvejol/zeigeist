import { createClient } from '@supabase/supabase-js';
import { Configuration, OpenAIApi } from 'openai';

const supabaseUrl = 'https://ovzrzmfunfpwljieqkrj.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Use environment variable
const openaiApiKey = process.env.OPENAI_API_KEY; // Use environment variable

const supabase = createClient(supabaseUrl, supabaseKey);

const configuration = new Configuration({
  apiKey: openaiApiKey,
});
const openai = new OpenAIApi(configuration);

async function anonymizePost(content) {
  const prompt = 
"lol"

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.7,
    });
    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error('OpenAI API error:', err);
    throw new Error('An error occurred while anonymizing the post.');
  }
}

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { post } = req.body;
      if (!post) throw new Error('Post content is missing.');

      const anonymizedPost = await anonymizePost(post);

      const { error } = await supabase.from('posts').insert({ post: anonymizedPost });
      if (error) throw new Error(error.message);

      res.status(200).json({ message: 'Post added successfully', post: anonymizedPost });
    } else if (req.method === 'GET') {
      const { data, error } = await supabase.from('posts').select('*').order('id', { ascending: false }).limit(5);
      if (error) throw new Error(error.message);

      res.status(200).json(data);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'A server error occurred', details: err.message });
  }
}