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

  // geometry
  get is2D (): this extends AABB<Point2D> ? true : false {
    return !('z' in this.min) as this extends AABB<Point2D> ? true : false
  }

  get is3D (): this extends AABB<Point3D> ? true : false {
    return !this.is2D as this extends AABB<Point3D> ? true : false
  }

  // length on x axis
  get width (): number {
    return this.max.x - this.min.x
  }

  // length on y axis
  get height (): number {
    return this.max.y - this.min.y
  }

  // length on z axis, 0 if 2D
  get depth (): number {
    return this.is3D ? (this.max as Point3D).z - (this.min as Point3D).z : 0
  }

  // area, width * height for 2d, 2 * (xy + xz + yz) for 3d
  get area (): number {
    if (this.is2D) {
      return this.width * this.height
    } else {
      return (
        2 *
        (this.width * this.height +
          this.width * this.depth +
          this.height * this.depth)
      )
    }
  }

  // volume, 0 if 2D
  get volume (): number {
    if (this.is2D) {
      return 0
    } else {
      return this.width * this.height * this.depth
    }
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

export type AABBType<P extends Point<boolean> = Point2D> = AABB<P>

// workaround from https://github.com/microsoft/TypeScript/issues/35387#issuecomment-559152671
// subscribe feature to https://github.com/microsoft/TypeScript/issues/40451#issue-696949269
const OVERRIDE_AABB = AABB as {
  new (min: Point2D, max: Point2D): AABB<Point2D>
  new (min: Point3D, max: Point3D): AABB<Point3D>
} & Omit<typeof AABB, 'new'>

export const AABB2D = AABB as {
  new (min: Point2D, max: Point2D): AABB<Point2D>
  from: (min: Point2D, max: Point2D) => AABB<Point2D>
} & Omit<typeof OVERRIDE_AABB, 'new' | 'from'>

export const AABB3D = AABB as {
  new (min: Point3D, max: Point3D): AABB<Point3D>
  from: (min: Point3D, max: Point3D) => AABB<Point3D>
} & Omit<typeof OVERRIDE_AABB, 'new' | 'from'>

export default OVERRIDE_AABB
