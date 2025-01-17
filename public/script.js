let currentPostIndex = 0; // Index for the current post being displayed
let posts = []; // Store the current batch of posts
let offset = 0; // Offset to fetch the next batch

async function fetchPosts() {
  try {
      const response = await fetch(`/api/posts?offset=${offset}`);
      const data = await response.json();

      if (!Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          return;
      }

      if (data.length === 0) {
          console.log("No more posts available.");
          return; // No more posts to load
      }

      posts = data; // Store the new batch of posts
      currentPostIndex = 0; // Reset to the first post in the batch
      displayPost(currentPostIndex); // Display the first post of the batch
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
  if (currentPostIndex < posts.length - 1) {
      currentPostIndex += 1; // Show the next post in the current batch
      displayPost(currentPostIndex); // Display the next post
  } else {
      // If all posts in the current batch are shown, load the next batch
      offset += 10; // Move to the next batch
      fetchPosts(); // Fetch the next batch of posts
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