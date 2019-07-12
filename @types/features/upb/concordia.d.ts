import * as d3 from "d3";
import { ScatterPlot, Feature } from "../../plots";
import { Vector2D } from "../../utils";
declare abstract class ConcordiaPlotFeature implements Feature {
    readonly plot: ScatterPlot;
    protected tickScale: d3.scale.Linear<number, number>;
    constructor(plot: ScatterPlot);
    abstract draw(): void;
    abstract undraw(): void;
    protected addConcordiaToPath(path: (string | number)[], concordia: ConcordiaFns | EnvelopeFn, startAge: number, endAge: number): void;
    protected abstract approximateSegment(path: (string | number)[], concordia: ConcordiaFns | EnvelopeFn, startAge: number, endAge: number): void;
}
export declare class WetherillConcordia extends ConcordiaPlotFeature {
    readonly plot: ScatterPlot;
    constructor(plot: ScatterPlot);
    draw(): void;
    undraw(): void;
    protected approximateSegment(path: (string | number)[], concordia: ConcordiaFns | EnvelopeFn, startAge: number, endAge: number): void;
}
export declare class TeraWasserburgConcordia extends ConcordiaPlotFeature {
    readonly plot: ScatterPlot;
    constructor(plot: ScatterPlot);
    draw(): void;
    undraw(): void;
    protected approximateSegment(path: (string | number)[], concordia: ConcordiaFns | EnvelopeFn, startAge: number, endAge: number): void;
    private constrainAge;
}
declare abstract class ConcordiaFns {
    x: ComponentFn;
    y: ComponentFn;
    upperEnvelope: EnvelopeFn;
    lowerEnvelope: EnvelopeFn;
    protected Σ_λ: number[][];
    vector(age: number): Vector2D;
    prime(age: number): Vector2D;
    protected abstract J_xyλ(age: number): number[][];
    protected deltaX(age: number): number;
    protected deltaY(age: number): number;
    private variance;
    private v;
}
interface ComponentFn {
    calculate(age: number): number;
    prime(age: number): number;
}
interface EnvelopeFn {
    x: ComponentFn;
    y: ComponentFn;
    vector(age: number): Vector2D;
    prime(age: number): Vector2D;
}
export {};
