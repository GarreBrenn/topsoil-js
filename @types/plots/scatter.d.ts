import * as d3 from "d3";
import AbstractPlot from "./plot-abstract";
import { DataEntry, Config } from "./const";
import { LayerDefinition } from "./plot";
import { RegressionBridge } from '../utils/bridge';
import { CircleBridge } from '../utils/bridge';
export default class ScatterPlot extends AbstractPlot {
    readonly root: HTMLDivElement;
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
    onZoomEnd: (xDomain: number[], yDomain: number[]) => void;
    private xLabel;
    private xAxisG;
    private yLabel;
    private yAxisG;
    regressionBridge: RegressionBridge;
    circleBridge: CircleBridge;
    constructor(root: HTMLDivElement, data: DataEntry[], options: Config, layers?: LayerDefinition);
    protected resize(): void;
    protected updateRightText(selector: d3.Selection<SVGElement>): void;
    update(): void;
    getDataExtents(): number[];
    changeAxisExtents(xMin: number, xMax: number, yMin: number, yMax: number, doInterpolate?: boolean): void;
    resetView(): void;
    snapToConcordia(): void;
}
