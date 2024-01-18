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

export type Ray<Is3D extends boolean = false> = Is3D extends true
  ? { start: Point3D, end: Point3D }
  : { start: Point2D, end: Point2D }

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

  // ======================== collision detection ========================
  // AABB-AABB collision detection
  static collide (a: AABB<Point2D>, b: AABB<Point2D>): boolean
  static collide (a: AABB<Point3D>, b: AABB<Point3D>): boolean
  static collide<Shape extends AABB = AABB<Point2D>>(
    a: Shape,
    b: Shape
  ): boolean {
    // whether intersect on x axis
    if (a.max.x < b.min.x || a.min.x > b.max.x) {
      return false
    }

    // whether intersect on y axis
    if (a.max.y < b.min.y || a.min.y > b.max.y) {
      return false
    }

    // whether intersect on z axis
    if (AABB.is3D(a) && AABB.is3D(b)) {
      if (a.max.z < b.min.z || a.min.z > b.max.z) {
        return false
      }
    }

    return true
  }

  collide (
    other: this extends AABB<Point2D> ? AABB<Point2D> : AABB<Point3D>
  ): boolean {
    // @ts-expect-error type derivation is ambiguous
    return AABB.collide(this, other)
  }

  // ======================== contain ========================
  contain (
    AABB: this extends AABB<Point2D> ? AABB<Point2D> : AABB<Point3D>
  ): boolean
  contain (point: this extends AABB<Point2D> ? Point2D : Point3D): boolean
  contain (
    input:
    | (this extends AABB<Point2D> ? AABB<Point2D> : AABB<Point3D>)
    | (this extends AABB<Point2D> ? Point2D : Point3D)
  ): boolean {
    if (input instanceof AABB) {
      if (
        this.min.x >= input.min.x ||
        this.min.y >= input.min.y ||
        this.max.x <= input.max.x ||
        this.max.y <= input.max.y
      ) {
        return false
      }
      if (AABB.is3D(this) && AABB.is3D(input)) {
        if (this.min.z >= input.min.z || this.max.z <= input.max.z) {
          return false
        }
      }
    } else {
      if (
        this.min.x >= input.x &&
        this.min.y >= input.y &&
        this.max.x <= input.x &&
        this.max.y <= input.y
      ) {
        return false
      }
      if (AABB.is3D(this) && 'z' in input) {
        if (this.min.z <= input.z && this.max.z >= input.z) {
          return false
        }
      }
    }
    return true
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
