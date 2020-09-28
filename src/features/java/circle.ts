import { ScatterPlot, FeatureInterface, findLayer, Feature, Variable, Option } from '../../plots';
import * as d3 from "d3";

export class Circle implements FeatureInterface {

    private static readonly CIRCLE_CLASS = "java-circle";
    private static readonly INFO_CLASS = "circle-info"
  
    private radius: number;
  
    draw(plot: ScatterPlot) {
  
      // Draw info box
      let info = plot.displayContainer.select("." + Circle.INFO_CLASS);
  
      if (info.empty()) {
        info = plot.displayContainer.append("text")
        .attr("class", Circle.INFO_CLASS)
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("x", 0)
        .attr("y", -20)
        .attr("fill", "black");
      }
  
      // Calculate line
      const {
        data,
        circleBridge: circle_bridge,
        x: {
          scale: xScale
        },
        y: {
          scale: yScale
        }
      } = plot;
  
  
      this.radius = circle_bridge.getRadius();
  
      // Draw line
      const layerToDrawOn = findLayer(plot, Feature.CIRCLE);
  
      let circle = layerToDrawOn.select("." + Circle.CIRCLE_CLASS);
      if (circle.empty()) {
        circle = layerToDrawOn.append("circle")
          .attr("class", Circle.CIRCLE_CLASS)
          .attr("stroke", "black")
          .attr("stroke-width", 2)
          .attr("cx", function() {return 50;})
          .attr("cy", function() {return 50;})
          .attr("r", function() {return this.radius;})
          .attr("fill", function() {return "steelblue";})
      }
  
      let infoWidth = (info.node() as SVGTextElement).getBBox().width;
      info
        .attr("x", 0);
  
      let leftText = plot.leftTextSVGElement;
      leftText.text("Radius: " + circle_bridge.getRadius());
  
    }
  
    undraw(plot: ScatterPlot) {
      const layerToDrawOn = findLayer(plot, Feature.MCLEAN_REGRESSION);
      layerToDrawOn.selectAll("." + Circle.CIRCLE_CLASS).remove();
      plot.displayContainer.selectAll("." + Circle.INFO_CLASS).remove();
      let leftText = plot.leftTextSVGElement;
      leftText.text("");
    }

}