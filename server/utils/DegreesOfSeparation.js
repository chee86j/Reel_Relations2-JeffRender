/**
 * Finds a shortest actor-to-actor path in an adjacency-list graph.
 *
 * Nodes are marked visited when they enter the queue, so dense casts do not
 * enqueue the same actor repeatedly. A predecessor map reconstructs only the
 * winning path instead of copying the full path for every queued actor.
 */
const bfs = (graph, casts1Id, casts2Id) => {
  if (casts1Id === casts2Id) {
    return [casts1Id];
  }

  const queue = [casts1Id];
  const visited = new Set([casts1Id]);
  const previous = new Map();
  let queueIndex = 0;

  while (queueIndex < queue.length) {
    const node = queue[queueIndex++];
    const neighbors = graph[node] || [];

    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) {
        continue;
      }

      visited.add(neighbor);
      previous.set(neighbor, node);

      if (neighbor === casts2Id) {
        const path = [casts2Id];
        let cursor = casts2Id;
        while (previous.has(cursor)) {
          cursor = previous.get(cursor);
          path.push(cursor);
        }
        return path.reverse();
      }

      queue.push(neighbor);
    }
  }

  return null;
};

module.exports = bfs;
