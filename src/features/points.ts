import { ScatterPlot, findLayer, Feature } from "../plots";

const POINT_CLASS = "point";

export const Points = {

  draw(plot: ScatterPlot): void {
    const {
      points_fill: fill,
      points_opacity: opacity
    } = plot.options;

    const layerToDrawOn = findLayer(plot, Feature.POINTS);

    const points = layerToDrawOn.selectAll("." + POINT_CLASS).data(plot.data);

    points.exit().remove();

    points
      .enter()
      .append("circle")
      .attr("class", POINT_CLASS)
      .attr("r", 2.5);
    // @bowring modified to show hollow datapoint when not selected 15 june 2020
    points
      .style("fill", d => {
        return d.selected ? fill : "none";
      })
      .style("stroke", d => {
        return d.selected ? "none" : fill;
      })
      .attr("opacity", opacity || 1)
      .attr("cx", d => plot.x.scale(d.x))
      .attr("cy", d => plot.y.scale(d.y));
  },

  undraw(plot: ScatterPlot): void {
    const layerToDrawOn = findLayer(plot, Feature.POINTS);
    
    layerToDrawOn.selectAll("." + POINT_CLASS).remove();
  }

};
