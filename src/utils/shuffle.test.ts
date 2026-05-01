import { describe, it, expect } from 'vitest'
import { isSolvable, shuffleTiles } from './shuffle'

describe('isSolvable', () => {
  it('should return true for a solved 3x3 puzzle', () => {
    const tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0]
    expect(isSolvable(tiles, 3)).toBe(true)
  })

  it('should return true for a solved 4x4 puzzle', () => {
    const tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]
    expect(isSolvable(tiles, 4)).toBe(true)
  })

  it('should return false for an unsolvable 3x3 configuration', () => {
    const tiles = [2, 1, 3, 4, 5, 6, 7, 8, 0]
    expect(isSolvable(tiles, 3)).toBe(false)
  })

  it('should return false for an unsolvable 4x4 configuration', () => {
    const tiles = [2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]
    expect(isSolvable(tiles, 4)).toBe(false)
  })
})

describe('shuffleTiles', () => {
  it('should return a solvable puzzle for 3x3', () => {
    const result = shuffleTiles(3)
    expect(result.tiles).toHaveLength(9)
    expect(isSolvable(result.tiles, 3)).toBe(true)
    expect(result.emptyIndex).toBe(result.tiles.indexOf(0))
  })

  it('should return a solvable puzzle for 4x4', () => {
    const result = shuffleTiles(4)
    expect(result.tiles).toHaveLength(16)
    expect(isSolvable(result.tiles, 4)).toBe(true)
  })

  it('should return a solvable puzzle for 5x5', () => {
    const result = shuffleTiles(5)
    expect(result.tiles).toHaveLength(25)
    expect(isSolvable(result.tiles, 5)).toBe(true)
  })

  it('should not return a solved puzzle', () => {
    const result = shuffleTiles(3)
    const solved = [1, 2, 3, 4, 5, 6, 7, 8, 0]
    expect(result.tiles).not.toEqual(solved)
  })
})
