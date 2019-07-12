import { ScatterPlot, Feature } from "../../plots";
export declare class EvolutionMatrix implements Feature {
    readonly plot: ScatterPlot;
    constructor(plot: ScatterPlot);
    draw(): void;
    undraw(): void;
}
