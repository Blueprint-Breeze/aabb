import { describe, expectTypeOf, test } from 'vitest'
import { AABB, type Point3D, type Point2D, type AABBType, AABB2D, AABB3D } from '..'

describe('AABB type test', () => {
  describe('Class instantiation test', () => {
    describe('new AABB', () => {
      test('instantiation 2D AABB', () => {
        const instance = new AABB({ x: 1, y: 1 }, { x: 2, y: 2 })
        expectTypeOf(instance).toEqualTypeOf<AABBType<Point2D>>()
        expectTypeOf(instance).not.toEqualTypeOf<AABBType<Point3D>>()
      })

      test('instantiation 3D AABB', () => {
        const instance = new AABB({ x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 2 })
        expectTypeOf(instance).toEqualTypeOf<AABBType<Point3D>>()
        expectTypeOf(instance).not.toEqualTypeOf<AABBType<Point2D>>()
      })

      test('type error and returns never when params is passed incorrectly', () => {
        // @ts-expect-error wrong params, 2D and 3D mixed
        const instance = new AABB({ x: 1, y: 1, z: 1 }, { x: 2, y: 2 })
        expectTypeOf(instance).toEqualTypeOf<never>()
      })
    })

    describe('new AABB2D', () => {
      test('instantiation 2D AABB', () => {
        const instance = new AABB2D({ x: 1, y: 1 }, { x: 2, y: 2 })
        expectTypeOf(instance).toEqualTypeOf<AABBType<Point2D>>()
        expectTypeOf(instance).not.toEqualTypeOf<AABBType<Point3D>>()
      })

      test('type error when passed 3D points', () => {
        // @ts-expect-error 3D AABB
        // eslint-disable-next-line no-new
        new AABB2D({ x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 2 })
      })
    })

    describe('new AABB3D', () => {
      test('instantiation 3D AABB', () => {
        const instance = new AABB3D({ x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 2 })
        expectTypeOf(instance).toEqualTypeOf<AABBType<Point3D>>()
        expectTypeOf(instance).not.toEqualTypeOf<AABBType<Point2D>>()
      })

      test('type error when passed 2D points', () => {
        // @ts-expect-error 2D AABB
        // eslint-disable-next-line no-new
        new AABB3D({ x: 1, y: 1 }, { x: 2, y: 2 })
      })
    })

    describe('AABB.from', () => {
      test('instantiation 2D AABB', () => {
        const instance = AABB.from({ x: 1, y: 1 }, { x: 2, y: 2 })
        expectTypeOf(instance).toEqualTypeOf<AABBType<Point2D>>()
        expectTypeOf(instance).not.toEqualTypeOf<AABBType<Point3D>>()
      })

      test('instantiation 3D AABB', () => {
        const instance = AABB.from({ x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 2 })
        expectTypeOf(instance).toEqualTypeOf<AABBType<Point3D>>()
        expectTypeOf(instance).not.toEqualTypeOf<AABBType<Point2D>>()
      })

      test('type error and returns never when params is passed incorrectly', () => {
        // @ts-expect-error wrong params, 2D and 3D mixed
        const instance = AABB.from({ x: 1, y: 1, z: 1 }, { x: 2, y: 2 })
        expectTypeOf(instance).toEqualTypeOf<never>()
      })
    })

    describe('AABB2D.from', () => {
      test('instantiation 2D AABB', () => {
        const instance = AABB2D.from({ x: 1, y: 1 }, { x: 2, y: 2 })
        expectTypeOf(instance).toEqualTypeOf<AABBType<Point2D>>()
        expectTypeOf(instance).not.toEqualTypeOf<AABBType<Point3D>>()
      })

      test('type error when passed 3D points', () => {
        // @ts-expect-error 3D AABB
        // eslint-disable-next-line no-new
        AABB2D.from({ x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 2 })
      })
    })

    describe('AABB3D.from', () => {
      test('instantiation 3D AABB', () => {
        const instance = AABB3D.from({ x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 2 })
        expectTypeOf(instance).toEqualTypeOf<AABBType<Point3D>>()
        expectTypeOf(instance).not.toEqualTypeOf<AABBType<Point2D>>()
      })

      test('type error when passed 2D points', () => {
        // @ts-expect-error 2D AABB
        // eslint-disable-next-line no-new
        AABB3D.from({ x: 1, y: 1 }, { x: 2, y: 2 })
      })
    })
  })
})
