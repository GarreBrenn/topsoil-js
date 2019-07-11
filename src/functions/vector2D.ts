import * as d3 from "d3";

export default class Vector2D extends Array<number> {

    constructor(public x: number, public y: number) {
      super(2);
      this[0] = x;
      this[1] = y;
    }

    plus(vector: Vector2D): Vector2D {
      return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    minus(vector: Vector2D): Vector2D {
      return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    times(scalar: number): Vector2D {
      return new Vector2D(this.x * scalar, this.y * scalar);
    }

    dividedBy(scalar: number): Vector2D {
      return new Vector2D(this.x / scalar, this.y / scalar);
    }

    scaleBy(
      xScale: d3.scale.Linear<number, number>, 
      yScale: d3.scale.Linear<number, number>
    ): Vector2D {
      return new Vector2D(xScale(this.x), yScale(this.y));
    }

}

