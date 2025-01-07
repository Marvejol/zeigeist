<h1>Get Similar Words</h1>
    <input type="text" id="wordInput" placeholder="Enter a word" />
    <button id="submitButton">Get Similar Words</button>
    <h2>Similar Words:</h2>
    <ul id="resultList"></ul>

    <script>
        const apiKey = '';

        document.getElementById('submitButton').addEventListener('click', async () => {
            const word = document.getElementById('wordInput').value;
            const similarWords = await getSimilarWords(word);
            displayResults(similarWords);
        });

        async function getSimilarWords(word) {
            const prompt = `Give me only 4 words that are most similar to ${word}, and respond only with the words separated by commas.`;

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini', // You can also use 'gpt-3.5-turbo'
                        messages: [
                            { role: "system", content: "You are a helpful assistant. Always respond with only a comma-separated list of words, without numbering or explanations." },
                            { role: "user", content: prompt }
                        ],
                        max_tokens: 50,
                        temperature: 0.3 // Lower temperature for more deterministic responses
                    })
                });

                const data = await response.json();
                const messageContent = data.choices[0].message.content.trim();

                // Clean and split the response into words
                return cleanResponse(messageContent);
            } catch (error) {
                console.error('Error fetching similar words:', error);
                return [];
            }
        }

        function cleanResponse(response) {
            // Split by commas and trim each word to remove extra whitespace
            return response
                .split(',')
                .map(word => word.trim())
                .filter(word => word.length > 0);
        }

        function displayResults(words) {
            const resultList = document.getElementById('resultList');
            resultList.innerHTML = ''; // Clear previous results
            words.forEach(word => {
                const listItem = document.createElement('li');
                listItem.textContent = word;
                resultList.appendChild(listItem);
            });
        }
    </script>