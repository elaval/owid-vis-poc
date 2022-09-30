import * as d3 from "d3";
export class OWIDBarChartTooltip {
    colorScale;
    tooltipContainer;
    toolTip;
    containerWidth;
    constructor(options) {
        this.colorScale =
            (options && options.colorScale) || d3.scaleOrdinal(d3.schemeCategory10);
        this.containerWidth = (options && options.containerWidth) || 800;
        this.tooltipContainer = d3.create("div").attr("class", "tooltip-container");
        this.toolTip = this.tooltipContainer
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
      <table>
        <thead>
          <tr><td colspan="3">DUMMY YEAR<td><tr>
        </thead>
        <tbody>
        </tbody>
      </table>
      `);
        this.toolTip
            .append("table")
            .style("font-size", "0.9em")
            .style("line-height", "1.4em")
            .style("white-space", "normal")
            .call((table) => table.append("thead"))
            .call((table) => table.append("tbody"));
    }
    render() {
        return this.tooltipContainer;
    }
    show(pos, options) {
        const year = options && options.year;
        const data = options && options.data;
        this.tooltipContainer
            .style("display", "block")
            .style("top", `${pos[1]}px`)
            .style("left", `${pos[0]}px`);
        // Add year information on table header
        this.toolTip.select("thead").select("td").text(year);
        // Add rows with entityName, value data
        this.toolTip
            .select("tbody")
            .selectAll("tr")
            .data(data)
            .join((enter) => {
            enter
                .append("tr")
                .call((tr) => tr
                .append("td")
                .attr("class", "symbol")
                .append("div")
                .attr("style", "width: 10px; height: 10px; border-radius: 5px; background-color: grey; display: inline-block; margin-right: 2px;"))
                .call((tr) => tr.append("td").attr("class", "entityName"))
                .call((tr) => tr.append("td").attr("class", "value"));
        }, (update) => {
            update
                .selectAll("td")
                .style("color", (d) => this.colorScale(d.entityName));
            update
                .select("td.symbol")
                .select("div")
                .style("background-color", (d) => this.colorScale(d.entityName));
            update.select("td.entityName").text((d) => d.entityName);
            update.select("td.value").text((d) => d.value);
        });
        // Check if tooltip goes beyond right border
        const tooltipWidth = this.tooltipContainer
            .node()
            .getBoundingClientRect().width;
        if (pos[0] > this.containerWidth - tooltipWidth) {
            this.tooltipContainer.style("left", `${pos[0] - tooltipWidth - 30}px`);
        }
    }
    hide() {
        this.tooltipContainer.style("display", "none");
    }
}
