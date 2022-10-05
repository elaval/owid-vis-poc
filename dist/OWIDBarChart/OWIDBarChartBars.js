import * as d3 from "d3";
import { config } from "./OWIDBarChartConfig";
export class OWIDBarChartBars {
    unit;
    entities;
    data;
    scales;
    chartContainer;
    constructor(data, options) {
        this.data = data;
        this.unit = options && options.unit;
        this.entities = this.data = data;
    }
    render(scales, context) {
        this.scales = scales;
        this.chartContainer = d3.create("svg:g");
        const bars = this.chartContainer
            .selectAll("rect.entity")
            .data(this.data, (d) => d.entityName)
            .join("rect")
            .attr("class", "entity")
            .attr("fill", "cyan")
            .attr("y", (d) => this.scales.y(d.entityName))
            .attr("height", this.scales.y.bandwidth())
            .attr("width", (d) => this.scales.x(d.value));
        const text = this.chartContainer
            .selectAll("text.value")
            .data(this.data, (d) => d.entityName)
            .join("text")
            .attr("class", "value barLabel")
            .attr("x", (d) => this.scales.x(d.value))
            .attr("y", (d) => this.scales.y(d.entityName))
            .attr("dy", this.scales.y.bandwidth() / 2 + config.valueFontSize / 2)
            .attr("dx", config.textValueDx)
            .attr("font-size", config.valueFontSize)
            .attr("text-anchor", "start")
            .text((d) => `${d.value} ${this.unit}`);
        return this.chartContainer;
    }
}
