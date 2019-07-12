import * as d3 from "d3";
import { DataEntry, Config } from "./const";
export default interface Plot {
    readonly root: HTMLDivElement;
    readonly canvas: d3.Selection<SVGGElement>;
    readonly dataLayer: d3.Selection<SVGGElement>;
    readonly featureLayer: d3.Selection<SVGGElement>;
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    readonly canvasWidth: number;
    readonly canvasHeight: number;
    data: DataEntry[];
    options: Config;
    javaBridge: any | null;
    update(): void;
}
