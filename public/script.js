async function fetchPosts() {
  try {
    const response = await fetch('/api/posts');  // Make GET request to the posts API
    const data = await response.json();

    if (response.ok) {
      // If the request is successful, loop through posts and display
      data.posts.forEach(post => {
        console.log(post.post); // Assuming each post has a 'post' field
      });
    } else {
      console.error('Error fetching posts:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Error fetching posts:', error.message);
  }
}

// Call the function to fetch posts
fetchPosts();