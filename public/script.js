let currentPostIndex = 0;
let posts = [];

async function fetchPosts() {
  try {
      const response = await fetch('/api/posts');
      const data = await response.json();

      if (!Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          return;
      }

      posts = data; // Store all posts
      currentPostIndex = 0; // Start from the first post
      displayPost(currentPostIndex); // Display the first post
  } catch (error) {
      console.error("Error fetching posts:", error);
  }
}

function displayPost(index) {
  const postContainer = document.getElementById('post-container');
  postContainer.innerHTML = ''; // Clear the container

  if (posts.length > 0 && posts[index]) {
      const postDiv = document.createElement('div');
      postDiv.textContent = posts[index].post; // Assuming each post object has a 'post' property
      postContainer.appendChild(postDiv);
  } else {
      postContainer.textContent = "No posts available";
  }
}

document.getElementById('next-post-button').addEventListener('click', () => {
  if (posts.length > 0) {
      currentPostIndex = (currentPostIndex + 1) % posts.length; // Loop back to start if at the end
      displayPost(currentPostIndex); // Display the next post
  }
});

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
          await fetchPosts(); // Refresh posts
      } else {
          const error = await response.json();
          console.error("Error adding post:", error);
      }
  } catch (error) {
      console.error("Error submitting post:", error);
  }
}

document.addEventListener('DOMContentLoaded', fetchPosts);