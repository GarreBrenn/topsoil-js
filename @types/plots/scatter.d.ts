import * as d3 from "d3";
import AbstractPlot from "./plot-abstract";
import { DataEntry, Config } from "./const";
export default class ScatterPlot extends AbstractPlot {
    readonly root: HTMLDivElement;
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    private features;
    canvas: d3.Selection<SVGGElement>;
    x: {
        axis: d3.svg.Axis;
        scale: d3.scale.Linear<number, number>;
    };
    y: {
        axis: d3.svg.Axis;
        scale: d3.scale.Linear<number, number>;
    };
    private zoom;
    onZoom: Function;
    private xLabel;
    private xAxisG;
    private yLabel;
    private yAxisG;
    constructor(root: HTMLDivElement, data: DataEntry[], options: Config);
    protected resize(): void;
    update(): void;
    getDataExtents(): number[];
    changeAxisExtents(xMin: number, xMax: number, yMin: number, yMax: number, doInterpolate?: boolean): void;
    resetView(): void;
    snapToConcordia(): void;
}
