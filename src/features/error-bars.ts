import { ScatterPlot, findLayer, Feature } from "../plots";

const G_CLASS = "error-bars-g",
      H_LINE_CLASS = "error-bars-h-line",
      V_LINE_CLASS = "error-bars-v-line",
      T_CAP_CLASS = "error-bars-t-cap",
      R_CAP_CLASS = "error-bars-r-cap",
      B_CAP_CLASS = "error-bars-b-cap",
      L_CAP_CLASS = "error-bars-l-cap";

export const ErrorBars = {
  
  draw(plot: ScatterPlot) {

    const {
      x: { scale: xScale },
      y: { scale: yScale },
      data,
      options: {
        uncertainty,
        error_bars_fill: fill,
        error_bars_opacity: opacity
      }
    } = plot;

    console.log("uncertainty: " + uncertainty + " typeOf: " + typeof uncertainty);

    const layerToDrawOn = findLayer(plot, Feature.ERROR_BARS);

    const validEntries = data.filter(d => {
      return d.sigma_x && d.sigma_y;
    });

    const unctBars = layerToDrawOn.selectAll("." + G_CLASS)
      .data(validEntries);

    unctBars.exit().remove();

    const enterGroup = unctBars.enter().append("g").data(validEntries)
      .attr("class", G_CLASS)
      .attr("opacity", opacity);
    
    enterGroup.append("line").attr("class", H_LINE_CLASS);
    enterGroup.append("line").attr("class", V_LINE_CLASS);
    enterGroup.append("line").attr("class", T_CAP_CLASS);
    enterGroup.append("line").attr("class", R_CAP_CLASS);
    enterGroup.append("line").attr("class", B_CAP_CLASS);
    enterGroup.append("line").attr("class", L_CAP_CLASS);

    const strokeWidth = (opacity < 1) ? 2 : 1;

    unctBars.selectAll("." + H_LINE_CLASS)
      .data((d) => [d])
      .attr("x1", d => xScale(d.x - (uncertainty * d.sigma_x)))
      .attr("y1", d => yScale(d.y))
      .attr("x2", d => xScale(d.x + (uncertainty * d.sigma_x)))
      .attr("y2", d => yScale(d.y))
      .attr("opacity", d => d.selected || plot.options.show_unincluded ? opacity || 1 : 0)
      .attr("stroke-width", strokeWidth)
      .attr("stroke", d => {
        return d.selected ? fill : "gray"
      });
    unctBars.selectAll("." + V_LINE_CLASS)
      .data((d) => [d])
      .attr("x1", d => xScale(d.x))
      .attr("y1", d => yScale(d.y - (uncertainty * d.sigma_y)))
      .attr("x2", d => xScale(d.x))
      .attr("y2", d => yScale(d.y + (uncertainty * d.sigma_y)))
      .attr("opacity", d => d.selected || plot.options.show_unincluded ? opacity || 1 : 0)
      .attr("stroke-width", strokeWidth)
      .attr("stroke", d => {
        return d.selected ? fill : "gray"
      });
    unctBars.selectAll("." + T_CAP_CLASS)
      .data((d) => [d])
      .attr("x1", d => xScale(d.x - 0.2 * (uncertainty * d.sigma_x)))
      .attr("y1", d => yScale(d.y + (uncertainty * d.sigma_y)))
      .attr("x2", d => xScale(d.x + 0.2 * (uncertainty * d.sigma_x)))
      .attr("y2", d => yScale(d.y + (uncertainty * d.sigma_y)))
      .attr("opacity", d => d.selected || plot.options.show_unincluded ? opacity || 1 : 0)
      .attr("stroke-width", strokeWidth)
      .attr("stroke", d => {
        return d.selected ? fill : "gray"
      });
    unctBars.selectAll("." + R_CAP_CLASS)
      .data((d) => [d])
      .attr("x1", d => xScale(d.x + (uncertainty * d.sigma_x)))
      .attr("y1", d => yScale(d.y - 0.2*(uncertainty * d.sigma_y)))
      .attr("x2", d => xScale(d.x + (uncertainty * d.sigma_x)))
      .attr("y2", d => yScale(d.y + 0.2*(uncertainty * d.sigma_y)))
      .attr("opacity", d => d.selected || plot.options.show_unincluded ? opacity || 1 : 0)
      .attr("stroke-width", strokeWidth)
      .attr("stroke", d => {
        return d.selected ? fill : "gray"
      });
    unctBars.selectAll("." + B_CAP_CLASS)
      .data((d) => [d])
      .attr("x1", d => xScale(d.x - 0.2 * (uncertainty * d.sigma_x)))
      .attr("y1", d => yScale(d.y - (uncertainty * d.sigma_y)))
      .attr("x2", d => xScale(d.x + 0.2 * (uncertainty * d.sigma_x)))
      .attr("y2", d => yScale(d.y - (uncertainty * d.sigma_y)))
      .attr("opacity", d => d.selected || plot.options.show_unincluded ? opacity || 1 : 0)
      .attr("stroke-width", strokeWidth)
      .attr("stroke", d => {
        return d.selected ? fill : "gray"
      });
    unctBars.selectAll("." + L_CAP_CLASS)
      .data((d) => [d])
      .attr("x1", d => xScale(d.x - (uncertainty * d.sigma_x)))
      .attr("y1", d => yScale(d.y - 0.2*(uncertainty * d.sigma_y)))
      .attr("x2", d => xScale(d.x - (uncertainty * d.sigma_x)))
      .attr("y2", d => yScale(d.y + 0.2*(uncertainty * d.sigma_y)))
      .attr("opacity", d => d.selected || plot.options.show_unincluded ? opacity || 1 : 0)
      .attr("stroke-width", strokeWidth)
      .attr("stroke", d => {
        return d.selected ? fill : "gray"
      });
      
  },

  undraw(plot: ScatterPlot) {
    const layerToDrawOn = findLayer(plot, Feature.ERROR_BARS);
    
    layerToDrawOn.selectAll("." + G_CLASS).remove();
  }

}