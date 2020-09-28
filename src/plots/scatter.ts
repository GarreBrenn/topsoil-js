import * as d3 from "d3";
import AbstractPlot from "./plot-abstract";
import { DataEntry, Config, Option, Feature } from "./const";
import { Ellipses } from "../features/ellipses";
import { Points } from "../features/points";
import { WetherillConcordia, TeraWasserburgConcordia } from "../features/upb/concordia";
import { EvolutionMatrix } from "../features/uth/evolution";
import { ErrorBars } from "../features/error-bars";
import { LayerDefinition } from "./plot";
import { McLeanRegression } from "../features/java/mclean-regression";
import { RegressionBridge } from '../utils/bridge';
import { CircleBridge } from '../utils/bridge';

const AXIS_CLASS = "axis";

export default class ScatterPlot extends AbstractPlot {

  private features: { [key: string]: any } = {};

  canvas: d3.Selection<SVGGElement>;

  x: { axis: d3.svg.Axis; scale: d3.scale.Linear<number, number> };
  y: { axis: d3.svg.Axis; scale: d3.scale.Linear<number, number> };

  private zoom: d3.behavior.Zoom<any>;
  onZoomEnd: (xDomain: number[], yDomain: number[]) => void

  private xLabel: d3.Selection<SVGElement>;
  private xAxisG: d3.Selection<SVGGElement>;
  private yLabel: d3.Selection<SVGElement>;
  private yAxisG: d3.Selection<SVGGElement>;

  regressionBridge: RegressionBridge;
  circleBridge: CircleBridge;

  constructor(
    readonly root: HTMLDivElement,
    data: DataEntry[],
    options: Config,
    layers?: LayerDefinition
  ) {
    super(root, data, options, layers);

    this.xAxisG = this.displayContainer
      .append("g") // x axis container
      .attr("class", AXIS_CLASS);

    this.xLabel = this.xAxisG
      .append("text") // x axis label
      // .attr("class", "axis-label")
      .attr("x", -8)
      .attr("y", -10)
      .style("font-size", "16px");

    this.yAxisG = this.displayContainer
      .append("g") // y axis container
      .attr("class", AXIS_CLASS);

    this.yLabel = this.yAxisG
      .append("text") // y axis label
      // .attr("class", "axis-label")
      .attr("y", 20)
      .attr("transform", "translate(0 8) rotate(-90)")
      .style("font-size", "16px")
      .attr("dy", ".1em");

    // Axes
    const { width, height } = this.root.getBoundingClientRect(),
      extents = this.getDataExtents(),
      xPadding = (extents[1] - extents[0]) * 0.05,
      yPadding = (extents[3] - extents[2]) * 0.05;
    const xScale = d3.scale
      .linear()
      .domain([extents[0] - xPadding, extents[1] + xPadding])
      .range([0, width - (this._margin.left + this._margin.right)]);
    const yScale = d3.scale
      .linear()
      .domain([extents[2] - yPadding, extents[3] + yPadding])
      .range([height - (this._margin.top + this._margin.bottom), 0]);

    const xAxis = d3.svg.axis().orient("bottom");
    const yAxis = d3.svg.axis().orient("left");

    this.x = {
      scale: xScale,
      axis: xAxis
    };
    this.y = {
      scale: yScale,
      axis: yAxis
    };

    // d3 zoom behavior
    this.zoom = d3.behavior
      .zoom()
      .x(this.x.scale)
      .y(this.y.scale);
    this.zoom.on("zoom", () => {
      this.update();
    });
    this.zoom.on("zoomend", () => {
      if (this.onZoomEnd) this.onZoomEnd(this.x.scale.domain(), this.y.scale.domain());
    });
    this.canvas.call(this.zoom);

    this.features["wetherill"] = new WetherillConcordia();
    this.features["tera-wasserburg"] = new TeraWasserburgConcordia();
    this.features["evolution"] = new EvolutionMatrix();
    this.features[Feature.MCLEAN_REGRESSION] = new McLeanRegression();

    this.update();
  }

  protected resize() {
    super.resize();

    this.xLabel
      .text(this.options[Option.X_AXIS])
      .attr(
        "x",
        this.canvasWidth -
        (this.xLabel.node() as HTMLElement).getBoundingClientRect().width - 8
      );

    this.yLabel
      .text(this.options[Option.Y_AXIS])
      .attr(
        "x",
        -(this.yLabel.node() as HTMLElement).getBoundingClientRect().height + "px"
      );

    this.x.scale.range([0, this.canvasWidth]);
    this.y.scale.range([this.canvasHeight, 0]);
    this.x.axis.ticks(Math.floor(this.canvasWidth / 50.0)).scale(this.x.scale);
    this.y.axis.ticks(Math.floor(this.canvasHeight / 50.0)).scale(this.y.scale);

    this.xAxisG
      .attr("transform", "translate(0 " + this.canvasHeight + ")")
      .call(this.x.axis);
    this.yAxisG.call(this.y.axis);

  }

  protected updateRightText(selector: d3.Selection<SVGElement>) {
    let uncertainty: string = "" + this.options[Option.UNCERTAINTY];
    let text = "Uncertainty:"

    if (uncertainty == "1" || uncertainty == "2") {
      text += " " + uncertainty + "σ";
    } else if (uncertainty == "2.4477") {
      text += " " + "95% Confidence";
    } else {
      text += " undefined"
    }
    
    selector.text(text);
  }

  update() {
    this.resize();

    let rightText = this.rightTextSVGElement;
    this.updateRightText(rightText);

    this.displayContainer
      .selectAll(`.${AXIS_CLASS} text`)
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px");
    this.displayContainer
      .selectAll(`.${AXIS_CLASS} path, .${AXIS_CLASS} line`)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", "1px")
      .attr("shape-rendering", "geometricPrecision");

    if (this.options[Option.ERROR_BARS]) {
      ErrorBars.draw(this);
    } else {
      ErrorBars.undraw(this);
    }

    if (this.options[Option.ELLIPSES]) {
      Ellipses.draw(this);
    } else {
      Ellipses.undraw(this);
    }

    if (this.options[Option.POINTS]) {
      Points.draw(this);
    } else {
      Points.undraw(this);
    }

    if (this.options[Option.CONCORDIA_LINE]) {
      if (this.options[Option.CONCORDIA_TYPE] === "tera-wasserburg") {
        this.features["tera-wasserburg"].draw(this);
        this.features["wetherill"].undraw(this);
      } else {
        this.features["wetherill"].draw(this);
        this.features["tera-wasserburg"].undraw(this);
      }
    } else {
      this.features["tera-wasserburg"].undraw(this);
      this.features["wetherill"].undraw(this);
    }
    if (this.options[Option.EVOLUTION]) {
      this.features["evolution"].draw(this);
    } else {
      this.features["evolution"].undraw(this);
    }

    if (this.regressionBridge) {
      if (this.options[Option.MCLEAN_REGRESSION]) {
        this.features[Feature.MCLEAN_REGRESSION].draw(this);
      } else {
        this.features[Feature.MCLEAN_REGRESSION].undraw(this);
      }
    }

    if (this.circleBridge) {
      this.features[Feature.CIRCLE].draw(this);
    }

    // Make upcalls to Java if bridge exists
    if (this.javaBridge) {
      const xDomain = this.x.scale.domain(),
        yDomain = this.y.scale.domain();
      this.javaBridge.syncAxes(xDomain[0], xDomain[1], yDomain[0], yDomain[1]);
    }
  }

  getDataExtents() {
    const extents = [1000000, -1000000, 1000000, -1000000];
    let sigmaX, sigmaY;
    this.data.forEach(d => {
      if (d.visible && (d.selected || this.options.show_unincluded)) {
        sigmaX = (d.sigma_x || 0) * (this.options[Option.UNCERTAINTY] || 1);
        sigmaY = (d.sigma_y || 0) * (this.options[Option.UNCERTAINTY] || 1);
        extents[0] = Math.min(extents[0], d.x - sigmaX);
        extents[1] = Math.max(extents[1], d.x + sigmaX);
        extents[2] = Math.min(extents[2], d.y - sigmaY);
        extents[3] = Math.max(extents[3], d.y + sigmaY);
      }
    });
    return extents;
  }

  changeAxisExtents(xMin: number, xMax: number, yMin: number, yMax: number, doInterpolate?: boolean) {
    if (doInterpolate) {
      const xScale = this.x.scale,
          yScale = this.y.scale,
          zoom = this.zoom,
          update = this.update.bind(this);

      d3.transition().duration(750).tween("zoom", function () {
        var ix = d3.interpolate(xScale.domain(), [xMin, xMax]);
        var iy = d3.interpolate(yScale.domain(), [yMin, yMax]);
        return function (t) {
          zoom.x(xScale.domain(ix(t))).y(yScale.domain(iy(t)));
          update();
        };
      });
    } else {
      this.zoom.x(this.x.scale.domain([xMin, xMax]))
        .y(this.y.scale.domain([yMin, yMax]));
      this.update();
    }
  };

  resetView() {
    const extents = this.getDataExtents(),
      xPadding = (extents[1] - extents[0]) * 0.05,
      yPadding = (extents[3] - extents[2]) * 0.05;
    this.changeAxisExtents(
      extents[0] - xPadding,
      extents[1] + xPadding,
      extents[2] - yPadding,
      extents[3] + yPadding,
      true
    );
  }

  snapToConcordia() {
    const xDomain = this.x.scale.domain(),
      xMin = xDomain[0],
      xMax = xDomain[1],
      lambda235 = this.options[Option.LAMBDA_235],
      lambda238 = this.options[Option.LAMBDA_238];

    // calculate the y min and max for the new coordinates
    const tMin = (1 / lambda235) * Math.log(xMin + 1),
      tMax = (1 / lambda235) * Math.log(xMax + 1),
      yMin = Math.exp(tMin * lambda238) - 1,
      yMax = Math.exp(tMax * lambda238) - 1;

    //change axes to snap the concordia to corners
    this.changeAxisExtents(xMin, xMax, yMin, yMax, true);
  }

}