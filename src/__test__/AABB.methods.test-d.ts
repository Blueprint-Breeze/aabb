import { describe, expectTypeOf, test } from 'vitest'
import { AABB } from '..'

describe('AABB methods test', () => {
  describe('AABB.is2D', () => {
    test('returns true when 2D AABB', () => {
      const instance = new AABB({ x: 1, y: 1 }, { x: 2, y: 2 })
      expectTypeOf(instance.is2D).toEqualTypeOf<true>()
    })
    test('returns false when 3D AABB', () => {
      const instance = new AABB({ x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 2 })
      expectTypeOf(instance.is2D).toEqualTypeOf<false>()
    })
  })

  describe('AABB.is3D', () => {
    test('returns true when 3D AABB', () => {
      const instance = new AABB({ x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 2 })
      expectTypeOf(instance.is3D).toEqualTypeOf<true>()
    })

    test('returns false when 2D AABB', () => {
      const instance = new AABB({ x: 1, y: 1 }, { x: 2, y: 2 })
      expectTypeOf(instance.is3D).toEqualTypeOf<false>()
    })
  })

  describe('AABB.collide', () => {
    test('2D AABB collide should accept 2D AABB', () => {
      const instance = new AABB({ x: 1, y: 1 }, { x: 2, y: 2 })
      const instance2 = new AABB({ x: 1, y: 1 }, { x: 2, y: 2 })
      expectTypeOf(instance.collide).toBeCallableWith(instance2)
    })

    test('3D AABB collide should accept 3D AABB', () => {
      const instance = new AABB({ x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 2 })
      const instance2 = new AABB({ x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 2 })
      expectTypeOf(instance.collide).toBeCallableWith(instance2)
    })
  })
})
