export function mergeComments(prev, next) {
  const map = new Map();

  [...prev, ...next].forEach((comment) => {
    if (!comment) return;
    if (!map.has(comment.id)) {
      map.set(comment.id, comment);
    } else {
      map.set(comment.id, { ...map.get(comment.id), ...comment });
    }
  });

  return Array.from(map.values());
}
