export type Cell = { x: number; y: number };

export const key = (c: Cell): string => `${c.x},${c.y}`;

export function gridDistance(a: Cell, b: Cell): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function gridNeighbors(cell: Cell, width: number, height: number): Cell[] {
  const candidates = [
    { x: cell.x + 1, y: cell.y },
    { x: cell.x - 1, y: cell.y },
    { x: cell.x, y: cell.y + 1 },
    { x: cell.x, y: cell.y - 1 }
  ];

  return candidates.filter((c) => c.x >= 0 && c.y >= 0 && c.x < width && c.y < height);
}
