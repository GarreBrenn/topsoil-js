import * as d3 from "d3";
import PlotOption from "./plot-option";
import Variable from "./variable";

export interface Plot {

  readonly root: HTMLDivElement;
  readonly canvas: d3.Selection<SVGGElement>;
  readonly dataLayer: d3.Selection<SVGGElement>;
  readonly featureLayer: d3.Selection<SVGGElement>;

  margin: { top: number; right: number; bottom: number; left: number };
  readonly canvasWidth: number;
  readonly canvasHeight: number;

  data: { [key in Variable]? : any }[];
  options: { [key in PlotOption]? : any };

  javaBridge: any | null;

  update(): void;
  
}

export interface PlotFeature {

  readonly plot: Plot;

  draw(): void;
  undraw(): void;

}