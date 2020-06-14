import { ScatterPlot, FeatureInterface, findLayer, Feature, Variable, Option } from '../../plots';
import { dot, transpose } from "numeric";
import * as d3 from "d3";

export interface McLeanRegressionLineInterface {
  getA(): number[][];
  getV(): number[][];
  getSav(): number[][];
  getMSWD(): number;
  getN(): number
}

export class McLeanRegression implements FeatureInterface {

  private static readonly LINE_CLASS = "mclean-line";
  private static readonly UPPER_ENVELOPE_CLASS = "mclean-upper-envelope";
  private static readonly LOWER_ENVELOPE_CLASS = "mclean-lower-envelope";
  private static readonly INFO_CLASS = "mclean-info"

  private yIntercept: number;
  private slope: number;
  private sav: number[][];

  private envelopeLowerBound: [number, number][];
  private envelopeUpperBound: [number, number][];

  draw(plot: ScatterPlot) {

    // Calculate line
    const {
      data,
      regressionBridge: regression,
      x: {
        scale: xScale
      },
      y: {
        scale: yScale
      }
    } = plot;

    const xList = [] as number[],
      yList = [] as number[],
      sigmaXList = [] as number[],
      sigmaYList = [] as number[],
      rhoList = [] as number[];

    data.forEach(d => {
      if (d[Variable.SELECTED]) {
        xList.push(d.x);
        yList.push(d.y);
        sigmaXList.push(d.sigma_x);
        sigmaYList.push(d.sigma_y);
        rhoList.push(d.rho);
      }
    });

    regression.fitLineToDataFor2D(xList.toString(), yList.toString(), sigmaXList.toString(), sigmaYList.toString(), rhoList.toString());

    this.slope = regression.getSlope();
    this.yIntercept = regression.getIntercept();

    // Draw line
    const layerToDrawOn = findLayer(plot, Feature.MCLEAN_REGRESSION);

    let line = layerToDrawOn.select("." + McLeanRegression.LINE_CLASS);
    if (line.empty()) {
      line = layerToDrawOn.append("line")
        .attr("class", McLeanRegression.LINE_CLASS)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    }

    // Update line
    // @bowring 12 JUNE 2020 : extended plotting to negative X
    const x1 = xScale.domain()[0],
          y1 = (this.slope * x1) + this.yIntercept,
          x2 = xScale.domain()[1],
          y2 = (this.slope * x2) + this.yIntercept;

    line.attr("x1", xScale(x1))
        .attr("y1", yScale(y1))
        .attr("x2", xScale(x2))
        .attr("y2", yScale(y2));


    // Get current envelope selections
    let upperEnvelope = layerToDrawOn.select("." + McLeanRegression.UPPER_ENVELOPE_CLASS);
    let lowerEnvelope = layerToDrawOn.select("." + McLeanRegression.LOWER_ENVELOPE_CLASS);

    // Undraw envelope if not specified
    if (! plot.options[Option.MCLEAN_REGRESSION_ENVELOPE]) {
      upperEnvelope.remove();
      lowerEnvelope.remove();
    } else {
      // Draw new envelopes if none exist
      if (upperEnvelope.empty()) {
        upperEnvelope = layerToDrawOn.append("path")
          .attr("class", McLeanRegression.UPPER_ENVELOPE_CLASS)
          .attr("stroke", "blue")
          .attr("stroke-width", 2)
          .attr("fill", "none")
          .style("stroke-dasharray", ("5, 5"));
      }
      if (lowerEnvelope.empty()) {
        lowerEnvelope = layerToDrawOn.append("path")
          .attr("class", McLeanRegression.LOWER_ENVELOPE_CLASS)
          .attr("stroke", "blue")
          .attr("stroke-width", 2)
          .attr("fill", "none")
          .style("stroke-dasharray", ("5, 5"));
      }

      const xMin = xScale.domain()[0],
            xMax = xScale.domain()[1],
            aXVar = regression.getAX(),
            aYVar = regression.getIntercept(),
            vXVar = regression.getVectorX(),
            vYVar = regression.getSlope(),
            subCov = this.sav || this.calcSav(regression.getSav()),
            tIncrement = (xMax - xMin) / 50;

      this.envelopeLowerBound = [];
      this.envelopeUpperBound = [];

      if (tIncrement > 0) {
        // @bowring changed step math to handle tiny values 14 June 2020
        for (let tStep = (xMin - tIncrement * 5); tStep <= (xMax + tIncrement * 5); tStep += tIncrement) {
          const vperp = [[-vYVar, vXVar]],
                Jxyab = [[0, 0], [1, tStep]],
                dot1 = dot(vperp, Jxyab),
                dot2 = dot(dot1, subCov),
                dot3 = dot(dot2, transpose(Jxyab)),
                dot4 = dot(dot3, transpose(vperp)) as number[][],
                thing5 = dot4[0][0],
                dot6 = dot(vperp, transpose(vperp)) as number[][],
                s2perp = thing5 / dot6[0][0],

                xv = 2 * Math.cos(Math.atan(-vXVar / vYVar)) * Math.sqrt(s2perp),
                yv = 2 * Math.sin(Math.atan(-vXVar / vYVar)) * Math.sqrt(s2perp),

                xplus = xScale(aXVar + vXVar * tStep + xv),
                yplus = yScale(aYVar + vYVar * tStep + yv),
                xminus = xScale(aXVar + vXVar * tStep - xv),
                yminus = yScale(aYVar + vYVar * tStep - yv);

          this.envelopeLowerBound.push([xminus, yminus]);
          this.envelopeUpperBound.push([xplus, yplus]);
        }
      }

      lowerEnvelope.attr("d", lineGenerator(this.envelopeLowerBound));
      upperEnvelope.attr("d", lineGenerator(this.envelopeUpperBound));
    }

    // Draw info box
    let info = plot.displayContainer.select("." + McLeanRegression.INFO_CLASS);

    if (info.empty()) {
      info = plot.displayContainer.append("text")
        .attr("class", McLeanRegression.INFO_CLASS)
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("x", 0)
        .attr("y", -20)
        .attr("fill", "black");
    }

    info.text("Regression slope: " + this.slope);
    let infoWidth = (info.node() as SVGTextElement).getBBox().width;
    info
      .attr("x", (plot.canvasWidth - 30) - infoWidth);

  }

  undraw(plot: ScatterPlot) {
    const layerToDrawOn = findLayer(plot, Feature.MCLEAN_REGRESSION);
    layerToDrawOn.selectAll("." + McLeanRegression.LINE_CLASS).remove();
    layerToDrawOn.selectAll("." + McLeanRegression.UPPER_ENVELOPE_CLASS).remove();
    layerToDrawOn.selectAll("." + McLeanRegression.LOWER_ENVELOPE_CLASS).remove();
    plot.displayContainer.selectAll("." + McLeanRegression.INFO_CLASS).remove();
  }

  private calcSav(savString: string) {
    let matrix: number[][] = [];
    const savList = savString.split(";");

    savList.forEach((arr, i) => {
      if (arr.length === 0) return;
      matrix.push([]);
      const values = arr.split(",");
      values.forEach((value, j) => {
        if (value === "") return;
        matrix[i].push(+value);
      })
    });

    this.sav = matrix;
    return matrix;
  }

}

const lineGenerator = d3.svg.line()
  .interpolate("cardinal")
  .x(d => d[0])
  .y(d => d[1]);
