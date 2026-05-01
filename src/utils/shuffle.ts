/**
 * Count inversions in the tiles array (excluding the blank tile 0).
 */
export function countInversions(tiles: number[]): number {
  let inversions = 0
  const withoutBlank = tiles.filter(t => t !== 0)
  for (let i = 0; i < withoutBlank.length; i++) {
    for (let j = i + 1; j < withoutBlank.length; j++) {
      if (withoutBlank[i] > withoutBlank[j]) {
        inversions++
      }
    }
  }
  return inversions
}

/**
 * Check if a puzzle configuration is solvable.
 * For odd grid sizes: inversions must be even.
 * For even grid sizes: (inversions + blank row from bottom) must be odd.
 */
export function isSolvable(tiles: number[], size: number): boolean {
  const inversions = countInversions(tiles)
  if (size % 2 === 1) {
    return inversions % 2 === 0
  }
  const blankIndex = tiles.indexOf(0)
  const blankRowFromBottom = size - Math.floor(blankIndex / size)
  return (inversions + blankRowFromBottom) % 2 === 1
}

/**
 * Fisher-Yates shuffle that guarantees solvability.
 */
export function shuffleTiles(size: number): { tiles: number[]; emptyIndex: number } {
  const totalTiles = size * size
  const tiles = Array.from({ length: totalTiles }, (_, i) => i)

  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tiles[i], tiles[j]] = [tiles[j], tiles[i]]
  }

  if (!isSolvable(tiles, size)) {
    const nonZeroIndices = tiles
      .map((t, i) => (t !== 0 ? i : -1))
      .filter(i => i !== -1)
    const [a, b] = nonZeroIndices
    ;[tiles[a], tiles[b]] = [tiles[b], tiles[a]]
  }

  const emptyIndex = tiles.indexOf(0)
  return { tiles, emptyIndex }
}
