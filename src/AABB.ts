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

export const ENDPOINTS_3D = [
  'top-left-front',
  'top-right-front',
  'top-left-back',
  'top-right-back',
  'bottom-left-front',
  'bottom-right-front',
  'bottom-left-back',
  'bottom-right-back'
] as const

export type Endpoint3D = (typeof ENDPOINTS_3D)[number]

export const ENDPOINTS_2D = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right'
] as const

export type Endpoint2D = (typeof ENDPOINTS_2D)[number]

export type Endpoint<Is3D extends boolean = false> = Is3D extends true
  ? Endpoint3D
  : Endpoint2D

export const EDGE_3D = [
  'top',
  'bottom',
  'left',
  'right',
  'front',
  'back'
] as const

export type Edge3D = (typeof EDGE_3D)[number]

export const EDGE_2D = ['top', 'bottom', 'left', 'right'] as const

export type Edge2D = (typeof EDGE_2D)[number]

export type Edge<Is3D extends boolean = false> = Is3D extends true
  ? Edge3D
  : Edge2D

/**
 *  y
 *  ^    z
 *  |   /
 *  |  /
 *  | /
 *  |/
 *  +-------------------> x
 *
 *  AABB(Axis-Aligned Bounding Box) is a box that is aligned with coordinate axis.
 */
class AABB<P extends Point<boolean> = Point2D> {
  // the minimum point in each direction of the coordinate axis
  min: P
  // the maximum point in each direction of the coordinate axis
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

  get center (): this extends AABB<Point3D> ? Point3D : Point2D {
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

  // ======================== move ========================
  // move relative to center
  translate (
    vectors: this extends AABB<Point3D> ? Partial<Point3D> : Partial<Point2D>
  ): this {
    const { x = 0, y = 0 } = vectors
    this.min.x += x
    this.min.y += y
    this.max.x += x
    this.max.y += y
    if (AABB.is3D(this)) {
      const { z = 0 } = vectors as Point3D;
      (this.min as Point3D).z += z;
      (this.max as Point3D).z += z
    }
    return this
  }

  moveTo (newMinPoint: this extends AABB<Point3D> ? Point3D : Point2D): this {
    if (AABB.is3D(this)) {
      if (!('z' in newMinPoint)) {
        throw new Error('newMinPoint must be 3D')
      }
      const { x, y, z } = newMinPoint
      const displacement: Point3D = {
        x: x - this.min.x,
        y: y - this.min.y,
        z: z - (this.min as Point3D).z
      }
      this.translate(displacement)
    }
    if (AABB.is2D(this)) {
      if ('z' in newMinPoint) {
        throw new Error('newMinPoint must be 2D')
      }
      const { x, y } = newMinPoint
      const displacement: Point2D = {
        x: x - this.min.x,
        y: y - this.min.y
      }
      this.translate(displacement)
    }
    return this
  }

  // ======================== resize ========================
  // scale from center
  scale (
    factors: this extends AABB<Point3D> ? Partial<Point3D> : Partial<Point2D>
  ): this {
    const { x = 1, y = 1 } = factors
    const center = this.center
    this.min.x = center.x + (this.min.x - center.x) * x
    this.min.y = center.y + (this.min.y - center.y) * y
    this.max.x = center.x + (this.max.x - center.x) * x
    this.max.y = center.y + (this.max.y - center.y) * y
    if (AABB.is3D(this) && 'z' in center) {
      const { z = 1 } = factors as Point3D;
      (this.min as Point3D).z = center.z + (this.min.z - center.z) * z;
      (this.max as Point3D).z = center.z + (this.max.z - center.z) * z
    }
    return this
  }

  resizeFormEndpoint (
    endpoint: this extends AABB<Point2D> ? Endpoint2D : Endpoint3D,
    displacement: this extends AABB<Point2D> ? Point2D : Point3D
  ): this {
    if (AABB.is3D(this)) {
      return this.__resizeFormEndpoint3D(
        endpoint as Endpoint3D,
        displacement as Point3D
      ) as unknown as this
    }
    if (AABB.is2D(this)) {
      return this.__resizeFormEndpoint2D(
        endpoint as Endpoint2D,
        displacement
      ) as unknown as this
    }
    return this
  }

  __resizeFormEndpoint2D (
    this: AABB<Point2D>,
    endpoint: Endpoint2D,
    displacement: Point2D
  ): AABB<Point2D> {
    if (!ENDPOINTS_2D.includes(endpoint)) {
      throw new Error(`Endpoint "${endpoint}" is not supported for 2D AABB`)
    }
    const { x, y } = displacement
    switch (endpoint) {
      case 'top-left':
        this.min.x = x
        this.max.y = y
        break
      case 'top-right':
        this.max.x = x
        this.max.y = y
        break
      case 'bottom-left':
        this.min.x = x
        this.min.y = y
        break
      case 'bottom-right':
        this.max.x = x
        this.min.y = y
        break
    }
    return this
  }

  __resizeFormEndpoint3D (
    this: AABB<Point3D>,
    endpoint: Endpoint3D,
    displacement: Point3D
  ): AABB<Point3D> {
    if (!ENDPOINTS_3D.includes(endpoint)) {
      throw new Error(`Endpoint "${endpoint}" is not supported for 3D AABB`)
    }
    const { x, y, z } = displacement
    switch (endpoint) {
      case 'top-left-front':
        this.min.x = x
        this.max.y = y
        this.min.z = z
        break
      case 'top-right-front':
        this.max.x = x
        this.max.y = y
        this.min.z = z
        break
      case 'top-left-back':
        this.min.x = x
        this.max.y = y
        this.max.z = z
        break
      case 'top-right-back':
        this.max.x = x
        this.max.y = y
        this.max.z = z
        break
      case 'bottom-left-front':
        this.min.x = x
        this.min.y = y
        this.min.z = z
        break
      case 'bottom-right-front':
        this.max.x = x
        this.min.y = y
        this.min.z = z
        break
      case 'bottom-left-back':
        this.min.x = x
        this.min.y = y
        this.max.z = z
        break
      case 'bottom-right-back':
        this.max.x = x
        this.min.y = y
        this.max.z = z
        break
    }
    return this
  }

  resizeFormEdge (
    edge: this extends AABB<Point2D> ? Edge2D : Edge3D,
    displacement: number
  ): this {
    if (AABB.is3D(this)) {
      return this.__resizeFormEdge3D(edge, displacement) as unknown as this
    }
    if (AABB.is2D(this)) {
      return this.__resizeFormEdge2D(
        edge as Edge2D,
        displacement
      ) as unknown as this
    }
    return this
  }

  __resizeFormEdge2D (
    this: AABB<Point2D>,
    edge: Edge2D,
    displacement: number
  ): AABB<Point2D> {
    if (!EDGE_2D.includes(edge)) {
      throw new Error(`Edge "${edge}" is not supported for 2D AABB`)
    }
    switch (edge) {
      case 'top':
        this.min.y = displacement
        break
      case 'bottom':
        this.max.y = displacement
        break
      case 'left':
        this.min.x = displacement
        break
      case 'right':
        this.max.x = displacement
        break
    }
    return this as unknown as AABB<Point2D>
  }

  __resizeFormEdge3D (
    this: AABB<Point3D>,
    edge: Edge3D,
    displacement: number
  ): AABB<Point3D> {
    if (!EDGE_3D.includes(edge)) {
      throw new Error(`Edge "${edge}" is not supported for 3D AABB`)
    }
    switch (edge) {
      case 'top':
        this.min.y = displacement
        break
      case 'bottom':
        this.max.y = displacement
        break
      case 'left':
        this.min.x = displacement
        break
      case 'right':
        this.max.x = displacement
        break
      case 'front':
        this.min.z = displacement
        break
      case 'back':
        this.max.z = displacement
        break
    }
    return this as unknown as AABB<Point3D>
  }

  // ======================== collision detection ========================
  // AABB-AABB collision detection
  static collide (a: AABB<Point2D>, b: AABB<Point2D>): boolean
  static collide (a: AABB<Point3D>, b: AABB<Point3D>): boolean
  static collide<Shape extends AABB = AABB<Point2D>>(
    a: Shape,
    b: Shape
  ): boolean {
    if (!a || !b) {
      throw new Error('Comparative items cannot be null or undefined')
    }
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
    if (!input) {
      throw new Error('Comparative items cannot be null or undefined')
    }
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
