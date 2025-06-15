export function formatPost(post) {
  const image_url = post.image_path
    ? post.image_path.replace(/\\/g, "/")
    : null;

  return {
    ...post,
    image_url,
  };
}

export function formatPosts(posts = []) {
  return posts.map(formatPost);
}
