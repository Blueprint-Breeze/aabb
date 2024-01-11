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

  // ======================== geometry ========================
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

  static is2D (input: unknown): input is AABB<Point2D> {
    return input instanceof AABB && !('z' in input.min) && !('z' in input.max)
  }

  get is2D (): this extends AABB<Point2D> ? true : false {
    return (!('z' in this.min) &&
      !('z' in this.max)) as this extends AABB<Point2D> ? true : false
  }

  static is3D (input: unknown): input is AABB<Point3D> {
    return input instanceof AABB && 'z' in input.min && 'z' in input.max
  }

  get is3D (): this extends AABB<Point3D> ? true : false {
    return ('z' in this.min && 'z' in this.max) as this extends AABB<Point3D>
      ? true
      : false
  }

  center (): this extends AABB<Point3D> ? Point3D : Point2D {
    if (AABB.is3D(this)) {
      const result: Point3D = {
        x: (this.min.x + this.max.x) / 2,
        y: (this.min.y + this.max.y) / 2,
        z: (this.min.z + this.max.z) / 2
      }
      return result as this extends AABB<Point3D> ? Point3D : Point2D
    } else {
      const result: Point2D = {
        x: (this.min.x + this.max.x) / 2,
        y: (this.min.y + this.max.y) / 2
      }
      return result as this extends AABB<Point3D> ? Point3D : Point2D
    }
  }

  // area, width * height for 2d, 2 * (xy + xz + yz) for 3d
  area (): number {
    if (AABB.is3D(this)) {
      return (
        2 *
        (this.width * this.height +
          this.width * this.depth +
          this.height * this.depth)
      )
    } else {
      return this.width * this.height
    }
  }

  // volume, 0 if 2D
  get volume (): this extends AABB<Point3D> ? number : 0 {
    if (AABB.is3D(this)) {
      return (this.width *
        this.height *
        this.depth) as this extends AABB<Point3D> ? number : 0
    } else {
      return 0
    }
  }

  // ======================== factory ========================
  static from (min: Point2D, max: Point2D): AABB<Point2D>
  static from (min: Point3D, max: Point3D): AABB<Point3D>
  static from<P extends Point<boolean> = Point2D>(min: P, max: P): AABB<P> {
    return new AABB<P>(min, max)
  }

  // ======================== other ========================
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
