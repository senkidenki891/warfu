export interface CellCoord {
  x: number;
  y: number;
}

export interface IGrid {
  readonly width: number;
  readonly height: number;

  isInside(coord: CellCoord): boolean;
  getNeighbors(coord: CellCoord): CellCoord[];
  getDistance(a: CellCoord, b: CellCoord): number;
  getCellsInRadius(center: CellCoord, radius: number): CellCoord[];
}

export interface SquareGridOptions {
  diagonalMovement?: boolean;
}

export class SquareGrid implements IGrid {
  public readonly width: number;
  public readonly height: number;
  private readonly diagonalMovement: boolean;

  constructor(width: number, height: number, options: SquareGridOptions = {}) {
    if (width <= 0 || height <= 0) {
      throw new Error('Grid dimensions must be positive numbers.');
    }

    this.width = width;
    this.height = height;
    this.diagonalMovement = options.diagonalMovement ?? false;
  }

  public isInside(coord: CellCoord): boolean {
    return (
      coord.x >= 0 && coord.y >= 0 && coord.x < this.width && coord.y < this.height
    );
  }

  public getNeighbors(coord: CellCoord): CellCoord[] {
    const orthogonal = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ];

    const diagonal = [
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
    ];

    const directions = this.diagonalMovement
      ? orthogonal.concat(diagonal)
      : orthogonal;

    return directions
      .map((dir) => ({ x: coord.x + dir.x, y: coord.y + dir.y }))
      .filter((neighbor) => this.isInside(neighbor));
  }

  public getDistance(a: CellCoord, b: CellCoord): number {
    // Manhattan distance keeps behavior compatible with potential future
    // axial/cube implementation where this can be swapped transparently.
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  public getCellsInRadius(center: CellCoord, radius: number): CellCoord[] {
    if (radius < 0) {
      return [];
    }

    const cells: CellCoord[] = [];

    for (let y = center.y - radius; y <= center.y + radius; y += 1) {
      for (let x = center.x - radius; x <= center.x + radius; x += 1) {
        const cell = { x, y };
        if (!this.isInside(cell)) {
          continue;
        }

        if (this.getDistance(center, cell) <= radius) {
          cells.push(cell);
        }
      }
    }

    return cells;
  }
}
