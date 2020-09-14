import * as d3 from "d3";
import * as numeric from "numeric";

import { cubicBezier } from "../utils";
import { ScatterPlot, DataEntry, findLayer, Feature } from "../plots";

const ELLIPSE_CLASS = "ellipse";

export const Ellipses = {

  draw(plot: ScatterPlot): void {

    const {
      ellipses_fill: fill,
      ellipses_opacity: opacity,
      uncertainty
    } = plot.options;

    console.log("options.reset_: " + plot.options.reset_view_on_change_unc);

    const layerToDrawOn = findLayer(plot, Feature.ELLIPSES);

    const ellipses = layerToDrawOn.selectAll("." + ELLIPSE_CLASS).data(calcEllipses(plot.data, uncertainty));

    ellipses.exit().remove();

    ellipses
      .enter()
      .append("path")
      .attr("class", ELLIPSE_CLASS);

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
      .attr("stroke", "black")
      .attr("opacity", d => d.selected || plot.options.show_unincluded ? 1 : 0);
  },
  
  undraw(plot: ScatterPlot): void {
    const layerToDrawOn = findLayer(plot, Feature.ELLIPSES);

    layerToDrawOn.selectAll("." + ELLIPSE_CLASS).remove();
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
