import { ScatterPlot } from "../plots";

export const UnctBars = {
  
  draw(plot: ScatterPlot) {

    const {
      x: { scale: xScale },
      y: { scale: yScale },
      options: {
        uncertainty,
        unctbars_fill: fill,
        unctbars_opacity: opacity
      }
    } = plot;

    const unctBars = plot.dataLayer.selectAll(".unct-bars-g")
      .data(plot.data);

    unctBars.exit().remove();

    const enterGroup = unctBars.enter().append("g").data(plot.data)
      .attr("class", "unct-bars-g")
      .attr("opacity", opacity);
    
    enterGroup.append("line").attr("class", "unct-bars-h-line");
    enterGroup.append("line").attr("class", "unct-bars-v-line");
    enterGroup.append("line").attr("class", "unct-bars-t-cap");
    enterGroup.append("line").attr("class", "unct-bars-r-cap");
    enterGroup.append("line").attr("class", "unct-bars-b-cap");
    enterGroup.append("line").attr("class", "unct-bars-l-cap");

    const strokeWidth = (opacity < 1) ? 2 : 1;

    unctBars.selectAll(".unct-bars-h-line")
      .attr("x1", d => xScale(d.x - (uncertainty * d.sigma_x)))
      .attr("y1", d => yScale(d.y))
      .attr("x2", d => xScale(d.x + (uncertainty * d.sigma_x)))
      .attr("y2", d => yScale(d.y))
      .attr("stroke-width", strokeWidth)
      .attr("stroke", fill);
    unctBars.selectAll(".unct-bars-v-line")
      .attr("x1", d => xScale(d.x))
      .attr("y1", d => yScale(d.y - (uncertainty * d.sigma_y)))
      .attr("x2", d => xScale(d.x))
      .attr("y2", d => yScale(d.y + (uncertainty * d.sigma_y)))
      .attr("stroke-width", strokeWidth)
      .attr("stroke", fill);
    unctBars.selectAll(".unct-bars-t-cap")
      .attr("x1", d => xScale(d.x - 0.2 * (uncertainty * d.sigma_x)))
      .attr("y1", d => yScale(d.y + (uncertainty * d.sigma_y)))
      .attr("x2", d => xScale(d.x + 0.2 * (uncertainty * d.sigma_x)))
      .attr("y2", d => yScale(d.y + (uncertainty * d.sigma_y)))
      .attr("stroke-width", strokeWidth)
      .attr("stroke", fill);
    unctBars.selectAll(".unct-bars-r-cap")
      .attr("x1", d => xScale(d.x + (uncertainty * d.sigma_x)))
      .attr("y1", d => yScale(d.y - 0.2*(uncertainty * d.sigma_y)))
      .attr("x2", d => xScale(d.x + (uncertainty * d.sigma_x)))
      .attr("y2", d => yScale(d.y + 0.2*(uncertainty * d.sigma_y)))
      .attr("stroke-width", strokeWidth)
      .attr("stroke", fill);
    unctBars.selectAll(".unct-bars-b-cap")
      .attr("x1", d => xScale(d.x - 0.2 * (uncertainty * d.sigma_x)))
      .attr("y1", d => yScale(d.y - (uncertainty * d.sigma_y)))
      .attr("x2", d => xScale(d.x + 0.2 * (uncertainty * d.sigma_x)))
      .attr("y2", d => yScale(d.y - (uncertainty * d.sigma_y)))
      .attr("stroke-width", strokeWidth)
      .attr("stroke", fill);
    unctBars.selectAll(".unct-bars-l-cap")
      .attr("x1", d => xScale(d.x - (uncertainty * d.sigma_x)))
      .attr("y1", d => yScale(d.y - 0.2*(uncertainty * d.sigma_y)))
      .attr("x2", d => xScale(d.x - (uncertainty * d.sigma_x)))
      .attr("y2", d => yScale(d.y + 0.2*(uncertainty * d.sigma_y)))
      .attr("stroke-width", strokeWidth)
      .attr("stroke", fill);
      
  },

  undraw(plot: ScatterPlot) {
    plot.dataLayer.selectAll(".unct-bars-g").remove();
  }

}