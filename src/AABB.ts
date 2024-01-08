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

export default class AABB<Is3D extends boolean = false> {
  min: Point<Is3D>
  max: Point<Is3D>

  constructor (min: Point<true>, max: Point<true>)
  constructor (min: Point<false>, max: Point<false>)
  constructor (min: Point<Is3D>, max: Point<Is3D>) {
    this.min = min
    this.max = max
  }

  // factory
  static from<Is3D extends true>(
    min: Point<Is3D>,
    max: Point<Is3D>
  ): AABB<Is3D>
  static from<Is3D extends false>(
    min: Point<Is3D>,
    max: Point<Is3D>
  ): AABB<Is3D>
  static from<Is3D extends boolean = false>(
    min: Point<Is3D>,
    max: Point<Is3D>
  ): AABB<Is3D> {
    return new AABB<Is3D>(min, max)
  }

  // other
  clone (): AABB<Is3D> {
    return new AABB<Is3D>(this.min, this.max)
  }

  toString (): string {
    return `AABB(${JSON.stringify(this.min)}, ${JSON.stringify(this.max)})`
  }
}

export class AABB2D extends AABB<false> {
  // factory
  static from (min: Point2D, max: Point2D): AABB2D {
    return super.from(min, max)
  }
}

export class AABB3D extends AABB<true> {
  // factory
  static from (min: Point3D, max: Point3D): AABB3D {
    return super.from(min, max)
  }
}
