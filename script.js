let posts = [];

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
        fetchPosts(); // Reload posts after submission
      })
      .catch(err => console.error('Error submitting post:', err));
    }
    postInput.value = ''; // clear input after submitting
  }

function fetchPosts() {
    fetch('/api/posts')
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


  //ONLOAD RENDER
  window.onload = fetchPosts;
