export interface Point2D {
  x: number
  y: number
}

export interface Point3D extends Point2D {
  z: number
}

export type Point<Is3D extends boolean = false> = Is3D extends true
  ? Point3D
  : Point2D

class AABB<P extends Point<boolean> = Point2D> {
  min: P
  max: P

  constructor (min: Point2D, max: Point2D)
  constructor (min: Point3D, max: Point3D)
  constructor (min: P, max: P) {
    this.min = min
    this.max = max
  }

  // factory
  static from (min: Point2D, max: Point2D): AABB<Point2D>
  static from (min: Point3D, max: Point3D): AABB<Point3D>
  static from<P extends Point<boolean> = Point2D>(min: P, max: P): AABB<P> {
    return new AABB<P>(min, max)
  }

  // other
  clone (): AABB<P> {
    return new AABB<P>(this.min, this.max)
  }

  toString (): string {
    return `AABB(${JSON.stringify(this.min)}, ${JSON.stringify(this.max)})`
  }
}

// workaround from https://github.com/microsoft/TypeScript/issues/35387#issuecomment-559152671
// subscribe feature to https://github.com/microsoft/TypeScript/issues/40451#issue-696949269
export default AABB as {
  new (min: Point2D, max: Point2D): AABB<Point2D>
  new (min: Point3D, max: Point3D): AABB<Point3D>
} & Omit<typeof AABB, 'new'>

export const AABB2D = AABB as {
  new (min: Point2D, max: Point2D): AABB<Point2D>
  from: (min: Point2D, max: Point2D) => AABB<Point2D>
} & Omit<typeof AABB, 'new' | 'from'>

export const AABB3D = AABB as {
  new (min: Point3D, max: Point3D): AABB<Point3D>
  from: (min: Point3D, max: Point3D) => AABB<Point3D>
} & Omit<typeof AABB, 'new' | 'from'>
