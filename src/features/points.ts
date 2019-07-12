import { ScatterPlot } from "../plots";

export const Points = {

  draw(plot: ScatterPlot): void {
    const {
      points_fill: fill,
      points_opacity: opacity
    } = plot.options;

    const points = plot.dataLayer.selectAll(".point").data(plot.data);

    points.exit().remove();

    points
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("r", 2.5);

    points
      .attr("fill", fill)
      .attr("opacity", opacity || 1)
      .attr("cx", d => plot.x.scale(d.x))
      .attr("cy", d => plot.y.scale(d.y));
  },

  undraw(plot: ScatterPlot): void {
    plot.dataLayer.selectAll(".point").remove();
  }

};
