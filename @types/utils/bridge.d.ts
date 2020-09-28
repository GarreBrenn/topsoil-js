import { McLeanRegressionLineInterface } from '../features/java/mclean-regression';
export interface JavaBridge {
    syncAxes(xMin: number, xMax: number, yMin: number, yMax: number): void;
}
export interface RegressionBridge {
    fitLineToDataFor2D(x: string, y: string, x1sigmaAbs: string, y1SigmaAbs: string, rhos: string): McLeanRegressionLineInterface;
    getAX(): number;
    getIntercept(): number;
    getRoundedIntercept(digits: number): number;
    getVectorX(): number;
    getSlope(): number;
    getRoundedSlope(digits: number): number;
    getV(): string;
    getSav(): string;
}
export interface CircleBridge {
    getRadius(): number;
}
