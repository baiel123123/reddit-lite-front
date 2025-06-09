export function buildCommentTree(comments) {
  const map = {};
  const roots = [];

  // Создаём словарь комментариев по ID
  comments.forEach(comment => {
    map[comment.id] = { ...comment, children: [] };
  });

  // Строим дерево
  comments.forEach(comment => {
    if (comment.parent_id) {
      const parent = map[comment.parent_id];
      if (parent) {
        parent.children.push(map[comment.id]);
      }
    } else {
      roots.push(map[comment.id]);
    }
  });

  return roots;
}
