import * as d3 from "d3";
import { ScatterPlot, FeatureInterface } from "../../plots";
import { Vector2D } from "../../utils";
declare abstract class ConcordiaPlotFeature implements FeatureInterface {
    protected tickScale: d3.scale.Linear<number, number>;
    abstract draw(plot: ScatterPlot): void;
    abstract undraw(plot: ScatterPlot): void;
    protected addConcordiaToPath(path: (string | number)[], concordia: ConcordiaFns | EnvelopeFn, startAge: number, endAge: number, xScale: d3.scale.Linear<number, number>, yScale: d3.scale.Linear<number, number>): void;
    protected abstract approximateSegment(path: (string | number)[], concordia: ConcordiaFns | EnvelopeFn, startAge: number, endAge: number, xScale: d3.scale.Linear<number, number>, yScale: d3.scale.Linear<number, number>): void;
}
export declare class WetherillConcordia extends ConcordiaPlotFeature {
    private static readonly LINE_CLASS;
    private static readonly ENVELOPE_CLASS;
    private static readonly TICK_CLASS;
    private static readonly TICK_LABEL_CLASS;
    draw(plot: ScatterPlot): void;
    undraw(plot: ScatterPlot): void;
    protected approximateSegment(path: (string | number)[], concordia: ConcordiaFns | EnvelopeFn, startAge: number, endAge: number, xScale: d3.scale.Linear<number, number>, yScale: d3.scale.Linear<number, number>): void;
}
export declare class TeraWasserburgConcordia extends ConcordiaPlotFeature {
    draw(plot: ScatterPlot): void;
    undraw(plot: ScatterPlot): void;
    protected approximateSegment(path: (string | number)[], concordia: ConcordiaFns | EnvelopeFn, startAge: number, endAge: number, xScale: d3.scale.Linear<number, number>, yScale: d3.scale.Linear<number, number>): void;
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
