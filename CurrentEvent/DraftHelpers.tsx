export function getSnakeDraftOrder(captains: { username: string }[], totalPicks: number) {
  const order: { username: string; pick: number }[] = [];
  let direction = 1; // 1 = forward, -1 = backward
  let pick = 1;
  while (order.length < totalPicks) {
    const indices = direction === 1
      ? [...Array(captains.length).keys()]
      : [...Array(captains.length).keys()].reverse();
    for (const i of indices) {
      if (order.length >= totalPicks) break;
      const captain = captains[i];
      if (!captain) continue;
      order.push({ username: captain.username, pick });
      pick++;
    }
    direction *= -1;
  }
  return order;
}