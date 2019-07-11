import PlotOption from "../plots/plot-option";
import ScatterPlot from "../plots/scatter";

export const Points = {

  draw(plot: ScatterPlot): void {
    const points = plot.dataLayer.selectAll(".point").data(plot.data);

    points.exit().remove();

    points
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("r", 2.5);

    points
      .attr("fill", plot.options[PlotOption.POINTS_FILL])
      .attr("cx", d => plot.x.scale(d.x))
      .attr("cy", d => plot.y.scale(d.y));
  },

  undraw(plot: ScatterPlot): void {
    plot.dataLayer.selectAll(".point").remove();
  }

};
