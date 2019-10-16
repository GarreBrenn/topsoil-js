import { ScatterPlot, FeatureInterface } from '../../plots';
export interface McLeanRegressionLineInterface {
    getA(): number[][];
    getV(): number[][];
    getSav(): number[][];
    getMSWD(): number;
    getN(): number;
}
export declare class McLeanRegression implements FeatureInterface {
    private static readonly LINE_CLASS;
    private static readonly UPPER_ENVELOPE_CLASS;
    private static readonly LOWER_ENVELOPE_CLASS;
    private static readonly INFO_CLASS;
    private yIntercept;
    private slope;
    private sav;
    private envelopeLowerBound;
    private envelopeUpperBound;
    draw(plot: ScatterPlot): void;
    undraw(plot: ScatterPlot): void;
    private calcSav;
}
