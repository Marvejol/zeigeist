let posts = [];

function submitPost() {
  const postInput = document.getElementById('postInput');
  const newPost = postInput.value.trim();
  
  if (newPost) {
    fetch('https://zeigeist.vercel.app/api/posts', {  // Correct endpoint here
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: newPost }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      fetchPosts(); // Reload posts after submission
    })
    .catch(err => console.error('Error submitting post:', err));
  }
  postInput.value = ''; // Clear input after submitting
}

function fetchPosts() {
    fetch('/api/posts')
      .then((response) => response.json())
      .then((data) => {
        // Verifica se la risposta è un array
        if (Array.isArray(data)) {
          const feed = document.getElementById('feed');
          feed.innerHTML = '';
          data.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.textContent = post.post;
            feed.appendChild(postElement);
          });
        } else {
          console.error('Error: Expected an array, but got:', data);
        }
      })
      .catch((err) => console.error('Error fetching posts:', err));
}

// Load posts when the page loads
window.onload = fetchPosts;