export interface Point<Is3D = false> {
  x: number
  y: number
  z: Is3D extends true ? number : never
}

export default class AABB<Is3D = false> {
  min: Point<Is3D>
  max: Point<Is3D>

  constructor (min: Point<Is3D>, max: Point<Is3D>) {
    this.min = min
    this.max = max
  }

  // other
  clone (): AABB<Is3D> {
    return new AABB(this.min, this.max)
  }

  toString (): string {
    return `AABB(${JSON.stringify(this.min)}, ${JSON.stringify(this.max)})`
  }
}
