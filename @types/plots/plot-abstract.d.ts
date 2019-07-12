import * as d3 from "d3";
import Plot from "./plot";
import { DataEntry, Config } from "./const";
export default abstract class AbstractPlot implements Plot {
    readonly root: HTMLDivElement;
    readonly canvas: d3.Selection<SVGGElement>;
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    private _canvasWidth;
    private _canvasHeight;
    protected _data: DataEntry[];
    protected _options: Config;
    readonly svg: d3.Selection<SVGSVGElement>;
    readonly displayContainer: d3.Selection<SVGGElement>;
    readonly titleLabel: d3.Selection<SVGElement>;
    readonly background: d3.Selection<SVGGElement>;
    readonly border: d3.Selection<SVGGElement>;
    readonly dataLayer: d3.Selection<SVGGElement>;
    readonly featureLayer: d3.Selection<SVGGElement>;
    javaBridge: any | null;
    constructor(root: HTMLDivElement, data: DataEntry[], options: Config);
    data: DataEntry[];
    setDataFromJSON(data: string): void;
    options: Config;
    setOptionsFromJSON(options: string): void;
    readonly canvasWidth: number;
    readonly canvasHeight: number;
    protected resize(): void;
    abstract update(): void;
}
