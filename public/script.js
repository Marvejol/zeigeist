async function fetchPosts() {
  try {
      const response = await fetch('/api/posts');
      const data = await response.json();

      if (!Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          return;
      }

      const postContainer = document.getElementById('post-container');
      postContainer.innerHTML = ''; // Clear the container

      const lastFivePosts = data.slice(-5).reverse(); // Get the last 5 posts
      lastFivePosts.forEach(post => {
          const postDiv = document.createElement('div');
          postDiv.textContent = post.post;
          postContainer.appendChild(postDiv);
      });
  } catch (error) {
      console.error("Error fetching posts:", error);
  }
}

async function submitPost() {
  const postContent = document.getElementById('post-input').value;
  if (!postContent) {
      alert("Post content cannot be empty!");
      return;
  }

  try {
      const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ post: postContent })
      });

      if (response.ok) {
          document.getElementById('post-input').value = ''; // Clear input
          fetchPosts(); // Refresh posts
      } else {
          const error = await response.json();
          console.error("Error adding post:", error);
      }
  } catch (error) {
      console.error("Error submitting post:", error);
  }
}

document.addEventListener('DOMContentLoaded', fetchPosts);