import * as d3 from "d3";
import * as numeric from "numeric";

import { cubicBezier } from "../utils";
import { ScatterPlot, DataEntry } from "../plots";

export const Ellipses = {

  draw(plot: ScatterPlot): void {

    const {
      ellipses_fill: fill,
      ellipses_opacity: opacity,
      uncertainty
    } = plot.options;

    const ellipses = plot.dataLayer.selectAll(".ellipse").data(calcEllipses(plot.data, uncertainty));

    ellipses.exit().remove();

    ellipses
      .enter()
      .append("path")
      .attr("class", "ellipse");

    ellipses
      .attr("d", d => {
        const ellipsePath = d3.svg
          .line()
          .x(datum => {
            return plot.x.scale(datum[0]);
          })
          .y(datum => {
            return plot.y.scale(datum[1]);
          })
          .interpolate(points => {
            let i = 1,
              path = [points[0][0].toString(), ",", points[0][1].toString()];
            while (i + 3 <= points.length) {
              cubicBezier(path, points[i++], points[i++], points[i++]);
            }
            return path.join("");
          });
        return ellipsePath(d.controlPoints);
      })
      .attr("fill", d => {
        return d.selected ? fill : "gray";
      })
      .attr("fill-opacity", opacity * 0.2)
      .attr("stroke", "black");
  },
  
  undraw(plot: ScatterPlot): void {
    plot.dataLayer.selectAll(".ellipse").remove();
  }

};

type ControlPoint = [number, number]
type EllipseDatum = {
  controlPoints: ControlPoint[];
  selected: boolean;
};

function calcEllipses(data: DataEntry[], uncertainty: number): EllipseDatum[] {
  const k = (4 / 3) * (Math.sqrt(2) - 1);
  const controlPointsBase: ControlPoint[] = [
    [1, 0],
    [1, k],
    [k, 1],
    [0, 1],
    [-k, 1],
    [-1, k],
    [-1, 0],
    [-1, -k],
    [-k, -1],
    [0, -1],
    [k, -1],
    [1, -k],
    [1, 0]
  ];

  const validEntries = data.filter(d => {
    return d.sigma_x && d.sigma_y;
  });

  const ellipseData = validEntries.map(d => {
    const r: [[number, number], [number, number]] = [
      [d.sigma_x, d.rho * d.sigma_y],
      [0, d.sigma_y * Math.sqrt(1 - d.rho * d.rho)]
    ];

    const shift = function(dx: number, dy: number): (p: number[]) => number[] {
      return function(p: [number, number]): [number, number] {
        return [p[0] + dx, p[1] + dy];
      };
    };

    return {
      controlPoints: numeric
        .mul(uncertainty as any, numeric.dot(controlPointsBase, r))
        .map(shift(d.x, d.y)) as ControlPoint[],
      selected: d.selected
    };
  });
  return ellipseData;
}
