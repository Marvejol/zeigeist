// Funzione per inviare un nuovo post
function submitPost() {
  const postInput = document.getElementById('postInput');
  const newPost = postInput.value.trim();

  if (newPost) {
    fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: newPost }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        fetchPosts();  // Ricarica i post dopo averne aggiunto uno
      })
      .catch(err => console.error('Error submitting post:', err));
  }
  postInput.value = '';  // Pulisce il campo di input
}

// Funzione per recuperare i post esistenti
function fetchPosts() {
  fetch('/api/posts')
    .then(response => response.json())
    .then(data => {
      const feed = document.getElementById('feed');
      feed.innerHTML = '';  // Pulisce il contenuto esistente
      data.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.textContent = post.post;
        feed.appendChild(postElement);
      });
    })
    .catch((err) => console.error('Error fetching posts:', err));
}

// Carica i post quando la pagina viene caricata
window.onload = fetchPosts;