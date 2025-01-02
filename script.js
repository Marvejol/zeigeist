let posts = [];

function submitPost() {
  const postInput = document.getElementById('postInput');
  const newPost = postInput.value.trim();
  
  if (newPost) {
    fetch('https://zeigeist.vercel.app/api/posts/api/posts', { // Modifica con il tuo dominio di Vercel
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: newPost }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      fetchPosts(); // Ricarica i post dopo aver inviato uno nuovo
    })
    .catch(err => console.error('Error submitting post:', err));
  }
  postInput.value = ''; // Azzera l'input dopo l'invio
}

function fetchPosts() {
  fetch('https://zeigeist.vercel.app/api/posts') // Modifica con il tuo dominio di Vercel
    .then((response) => response.json())
    .then((data) => {
      const feed = document.getElementById('feed');
      feed.innerHTML = '';
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