import * as d3 from "d3";
import { DataEntry, Config, Feature } from "./const";

export interface Plot {

  readonly root: HTMLDivElement;
  readonly canvas: d3.Selection<SVGGElement>;

  readonly layerMap: { [key in Feature]? : d3.Selection<SVGGElement> };
  readonly defaultLayer: d3.Selection<SVGGElement>;

  margin: { top: number; right: number; bottom: number; left: number };
  readonly canvasWidth: number;
  readonly canvasHeight: number;

  data: DataEntry[];
  options: Config;

  javaBridge: any | null;

  update(): void;
  
}

export type LayerDefinition = (Feature|Feature[]|(Feature|Feature[])[])[];
export type LayerMap = { [key in Feature]?: d3.Selection<SVGGElement> };
export function findLayer(plot: Plot, feature: Feature): d3.Selection<SVGGElement> {
  return (feature in plot.layerMap) ? plot.layerMap[feature] : plot.defaultLayer;
}

export interface FeatureInterface {
  draw(plot: Plot): void;
  undraw(plot: Plot): void;
}
