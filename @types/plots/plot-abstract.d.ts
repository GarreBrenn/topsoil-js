import * as d3 from "d3";
import { Plot, LayerDefinition, LayerMap } from "./plot";
import { DataEntry, Config } from "./const";
import { JavaBridge } from '../utils/bridge';
export default abstract class AbstractPlot implements Plot {
    readonly root: HTMLDivElement;
    readonly canvas: d3.Selection<SVGGElement>;
    private _canvasWidth;
    private _canvasHeight;
    protected _data: DataEntry[];
    protected _options: Config;
    protected _margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    readonly layerMap: LayerMap;
    readonly defaultLayer: d3.Selection<SVGGElement>;
    readonly svg: d3.Selection<SVGSVGElement>;
    readonly displayContainer: d3.Selection<SVGGElement>;
    readonly titleLabel: d3.Selection<SVGElement>;
    readonly background: d3.Selection<SVGGElement>;
    readonly border: d3.Selection<SVGGElement>;
    readonly leftTextBox: d3.Selection<SVGElement>;
    readonly rightTextBox: d3.Selection<SVGElement>;
    javaBridge: JavaBridge;
    constructor(root: HTMLDivElement, data: DataEntry[], options: Config, layers?: LayerDefinition);
    data: DataEntry[];
    setDataFromJSON(data: string): void;
    options: Config;
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    setOptionsFromJSON(options: string): void;
    readonly canvasWidth: number;
    readonly canvasHeight: number;
    protected resize(): void;
    protected leftText(): string;
    protected rightText(): string;
    abstract update(): void;
}
