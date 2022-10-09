import * as d3 from "d3";
export class OWIDMapTooltip {
    colorScale;
    toolTip;
    containerWidth;
    constructor(options) {
        this.colorScale =
            (options && options.colorScale) || d3.scaleOrdinal(d3.schemeCategory10);
        this.containerWidth = (options && options.containerWidth) || 800;
        this.toolTip = d3.create("div")
            .attr("class", "Tooltip")
            .style("display", "none")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("left", `${0}px`)
            .style("top", `${0}px`)
            .style("white-space", "nowrap")
            .style("background-color", "rgba(255, 255, 255, 0.95)")
            .style("box-shadow", "rgba(0, 0, 0, 0.12) 0px 2px 2px, rgba(0, 0, 0, 0.35) 0px 0px 1px")
            .style("border-radius", "2px")
            .style("text-align", "left")
            .style("font-size", "0.9em")
            .style("padding", "0.3em").html(`
      <div>
        <div class="name"></div>
        <div class="value-wrapper">
          <div class="value" style="color: rgb(183, 135, 95);"></div>
          <div class="time"></div>
        </div>
      </div>
      `);
    }
    render() {
        return this.toolTip;
    }
    show(pos, options) {
        const country = options && options.country;
        const value = options && options.value;
        const year = options && options.year;
        this.toolTip
            .style("display", "block")
            .style("top", `${pos[1]}px`)
            .style("left", `${pos[0] + 30}px`);
        // Add year information on table header
        this.toolTip.select("div.name").text(country);
        this.toolTip.select("div.value").text(value);
        this.toolTip.select("div.time").text(year);
        // Check if tooltip goes beyond right border
        const tooltipWidth = this.toolTip
            .node()
            .getBoundingClientRect().width;
        if (pos[0] > this.containerWidth - tooltipWidth) {
            this.toolTip.style("left", `${pos[0] - tooltipWidth}px`);
        }
    }
    hide() {
        this.toolTip.style("display", "none");
    }
}
