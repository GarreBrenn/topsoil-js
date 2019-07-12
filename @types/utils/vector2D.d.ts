import * as d3 from "d3";
export default class Vector2D extends Array<number> {
    x: number;
    y: number;
    constructor(x: number, y: number);
    plus(vector: Vector2D): Vector2D;
    minus(vector: Vector2D): Vector2D;
    times(scalar: number): Vector2D;
    dividedBy(scalar: number): Vector2D;
    scaleBy(xScale: d3.scale.Linear<number, number>, yScale: d3.scale.Linear<number, number>): Vector2D;
}
