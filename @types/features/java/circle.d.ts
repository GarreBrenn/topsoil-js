import { ScatterPlot, FeatureInterface } from '../../plots';
export declare class Circle implements FeatureInterface {
    private static readonly CIRCLE_CLASS;
    private static readonly INFO_CLASS;
    private radius;
    draw(plot: ScatterPlot): void;
    undraw(plot: ScatterPlot): void;
}
