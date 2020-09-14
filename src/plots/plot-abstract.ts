import * as d3 from "d3";
import { Plot, LayerDefinition, LayerMap } from "./plot";
import { DataEntry, Config, Feature } from "./const";
import { JavaBridge } from '../utils/bridge';

export default abstract class AbstractPlot implements Plot {

  readonly canvas: d3.Selection<SVGGElement>;

  private _canvasWidth: number;
  private _canvasHeight: number;

  protected _data: DataEntry[];
  protected _options: Config;
  protected _margin = {
    top: 110,
    right: 75,
    bottom: 75,
    left: 75
  }

  readonly layerMap: LayerMap;
  readonly defaultLayer: d3.Selection<SVGGElement>;

  readonly svg: d3.Selection<SVGSVGElement>;
  readonly displayContainer: d3.Selection<SVGGElement>;
  readonly titleLabel: d3.Selection<SVGElement>;
  readonly background: d3.Selection<SVGGElement>;
  readonly border: d3.Selection<SVGGElement>;

  readonly leftTextBox: d3.Selection<SVGElement>;
  readonly rightTextBox: d3.Selection<SVGElement>;

  errorTextBox: d3.Selection<SVGElement>;

  javaBridge: JavaBridge;

  constructor(readonly root: HTMLDivElement, data: DataEntry[], options: Config, layers?: LayerDefinition) {
    this._data = data;
    this._options = options;

    // Create plot containers
    const { width, height } = this.root.getBoundingClientRect();
    this._canvasWidth = Math.max(0, width - (this._margin.left + this._margin.right));
    this._canvasHeight = Math.max(0, height - (this._margin.top + this._margin.bottom));

    this.svg = d3
      .select(root)
      .append("svg")
      .attr("id", "plot_svg");

    this.displayContainer = this.svg
      .append("g")
      .attr("id", "displayContainer")
      .attr("transform", "translate(" + this._margin.left + "," + this._margin.top + ")");

    this.titleLabel = this.displayContainer
      .append("text")
      .attr("class", "title-text")
      .attr("font-family", "sans-serif")
      .attr("font-size", "24px");

    this.leftTextBox = this.svg
      .append("text")
      .attr("class", "left textbox")
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")

    this.rightTextBox = this.svg
      .append("text")
      .attr("class", "right textbox")
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")

    this.errorTextBox = this.svg
    .append("text")
    .attr("class", "error textbox")
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")

    this.canvas = this.displayContainer
      .append("g")
      .attr("clip-path", "url(#plotClipBox)");

    this.layerMap = layers ? constructLayerMap(this.canvas, layers) : {};

    this.defaultLayer = this.canvas.insert("g", ":first-child")
      .attr("class", "default-layer");

    this.background = this.canvas
      .insert("rect", ":first-child")
      .attr("id", "background")
      .attr("fill", "white");

    this.displayContainer
      .append("defs")
      .append("clipPath")
      .attr("id", "plotClipBox")
      .append("use")
      .attr("xlink:href", "#" + this.background.attr("id"));

    this.border = this.displayContainer
      .append("rect")
      .attr("id", "plot-border")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", "2px");

  }

  get data() {
    return this._data;
  }

  set data(data: DataEntry[]) {
    this._data = data;
    this.update();
  }

  setDataFromJSON(data: string) {
    this.data = JSON.parse(data);
  }

  get options() {
    return this._options;
  }

  set options(options: Config) {
    this._options = options;
    this.update();
  }

  get margin() {
    return this._margin;
  }

  set margin(margin: { top: number, right: number, bottom: number, left: number }) {
    this._margin = margin;
    this.update();
  }

  setOptionsFromJSON(options: string) {
    this.options = JSON.parse(options);
  }

  get canvasWidth() {
    return this._canvasWidth;
  }

  get canvasHeight() {
    return this._canvasHeight;
  }

  protected resize(): void {
    const { width, height } = this.root.getBoundingClientRect();
    this._canvasWidth = Math.max(0, width - (this._margin.left + this._margin.right));
    this._canvasHeight = Math.max(0, height - (this._margin.top + this._margin.bottom));

    this.displayContainer
      .attr("transform", "translate(" + this._margin.left + "," + this._margin.top + ")");

    this.svg
      .attr("width", width)
      .attr("height", height);
    this.background
      .attr("width", this._canvasWidth)
      .attr("height", this._canvasHeight);
    this.border
      .attr("width", this._canvasWidth)
      .attr("height", this._canvasHeight);

    const titleDimensions = (this.titleLabel.node() as SVGElement).getBoundingClientRect();

    this.titleLabel
      .text(this._options.title)
      .attr("x", (this._canvasWidth / 2) - (titleDimensions.width / 2))
      .attr("y", -(this._margin.top / 2) + (titleDimensions.height / 3));

    const textBoxWidth = (width / 2) - (titleDimensions.width / 2) - 10;

    this.leftTextBox
      .attr("x", ((width - this._canvasWidth) / 2))
      .attr("y", ((height - this._canvasHeight) / 2) + 10)
      .attr("fill", "red")
      .attr("width", textBoxWidth);

    this.rightTextBox
      .attr("text-anchor", "end")
      .attr("x", this._canvasWidth + ((width - this._canvasWidth) / 2))
      .attr("y", ((height - this._canvasHeight) / 2) + 10)
      .attr("fill", "red")
      .attr("width", textBoxWidth);

    this.errorTextBox
    .attr("x", ((width - this._canvasWidth) / 2))
    .attr("y", ((height - this._canvasHeight) / 2))
    .attr("width", 2*textBoxWidth)
    .text("Error: ");
  }

  public get leftTextSVGElement() : d3.Selection<SVGElement> {
    return this.leftTextBox;
  }
  
  public get rightTextSVGElement() : d3.Selection<SVGElement> {
    return this.rightTextBox;
  }

  abstract update(): void;

}

function constructLayerMap(parent: d3.Selection<SVGGElement>, layers: LayerDefinition): LayerMap {
  if (!parent) throw Error("A parent selection must be provided.");
  if (!layers) return {};

  const layerMap: { [key in Feature]?: d3.Selection<SVGGElement> } = {};
  layers.forEach(part => {
    const newLayer = parent.insert("g", ":first-child");
    if (part instanceof Array) {
      newLayer.attr("class", "layer-group")
      Object.assign(layerMap, constructLayerMap(newLayer, part));
    } else {
      newLayer.attr("class", part + "-layer")
      layerMap[part] = newLayer;
    }
  });
  return layerMap;
}