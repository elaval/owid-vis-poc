import * as d3 from "d3";
import * as _ from "lodash";
export class OWIDTrendChartLines {
    unit;
    entities;
    data;
    dotSizeStandard;
    dotSizeHighlighted;
    scaleColor;
    years;
    values;
    maxYear;
    visibleValues;
    seriesData;
    scales;
    chartContainer;
    constructor(data, options) {
        this.unit = options && options.unit;
        this.entities = this.data = data;
        this.dotSizeStandard = 2;
        this.dotSizeHighlighted = 4;
        this.scaleColor =
            (options && options.scaleColor) || d3.scaleOrdinal(d3.schemeCategory10);
        this.years = _.chain(data)
            .map((d) => d.year)
            .uniq()
            .value();
        this.values = _.chain(data)
            .map((d) => d.value)
            .uniq()
            .value();
        this.maxYear = _.max(this.years);
        this.visibleValues = _.range(Math.floor(_.min(this.values)), Math.ceil(_.max(this.values))).filter((d) => d % 5 == 0);
        this.seriesData = _.chain(data)
            .groupBy((d) => d.entityName)
            .map((items, entityName) => ({ name: entityName, data: items }))
            .value();
    }
    getScaleColor() {
        return this.scaleColor;
    }
    renderMarker(pos) {
        const selectedYear = this.years.find((d) => d == Math.floor(this.scales.x.invert(pos[0])));
        this.chartContainer
            .selectAll("g.serie")
            .selectAll("circle.dot")
            .attr("r", (d) => (d.year == selectedYear ? 4 : 2));
        this.chartContainer
            .selectAll("line.marker")
            .data([selectedYear])
            .join("line")
            .attr("class", "marker")
            .attr("y1", this.scales.y.range()[1])
            .attr("y2", this.scales.y.range()[0])
            .attr("x1", this.scales.x(selectedYear))
            .attr("x2", this.scales.x(selectedYear))
            .attr("stroke", "grey")
            .attr("stroke-width", 1);
    }
    showMarker(year) {
        this.chartContainer
            .selectAll("g.serie")
            .selectAll("circle.dot")
            .attr("r", (d) => d.year == year ? this.dotSizeHighlighted : this.dotSizeStandard);
        this.chartContainer
            .selectAll("line.marker")
            .data([year])
            .join("line")
            .attr("class", "marker")
            .attr("y1", this.scales.y.range()[1])
            .attr("y2", this.scales.y.range()[0])
            .attr("x1", this.scales.x(year))
            .attr("x2", this.scales.x(year))
            .attr("stroke", "grey")
            .attr("stroke-width", 1);
    }
    hideMarker() {
        this.chartContainer
            .selectAll("g.serie")
            .selectAll("circle.dot")
            .attr("r", this.dotSizeStandard);
        this.chartContainer.selectAll("line.marker").remove();
    }
    selectedYear(pos) {
        const selectedYear = this.years.find((d) => d == Math.floor(this.scales.x.invert(pos[0])));
        return selectedYear;
    }
    render(scales, context) {
        this.scales = scales;
        scales.x.domain(d3.extent(this.years));
        scales.y.domain(d3.extent(this.values));
        this.chartContainer = d3.create("svg:g");
        const line = d3
            .line()
            .x((d) => scales.x(d.year))
            .y((d) => scales.y(d.value));
        const series = this.chartContainer
            .selectAll("g.serie")
            .data(this.seriesData, (d) => d.name)
            .join("g")
            .attr("class", (d) => `serie ${d.name}`);
        const lines = series
            .selectAll("path")
            .data((d) => [d.data])
            .join("path")
            .attr("d", (d) => line(d))
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("stroke", (d) => this.scaleColor(d[0].entityName));
        const dots = series
            .selectAll("circle.dot")
            .data((d) => d.data)
            .join("circle")
            .attr("class", "dot")
            .attr("fill", (d) => this.scaleColor(d.entityName))
            .attr("cx", (d) => scales.x(d.year))
            .attr("cy", (d) => scales.y(d.value))
            .attr("r", 2);
        const legendMark = series
            .selectAll("g.legendMark")
            .data((d) => [_.last(d.data)])
            .join("g")
            .attr("class", "legendMark")
            .attr("transform", (d) => `translate(${scales.x(this.maxYear)},${scales.y(d.value)})`);
        legendMark
            .selectAll("text")
            .data((d) => [d])
            .join("text")
            .attr("dx", 10)
            .attr("text-anchor", "start")
            .attr("font-size", 12)
            .attr("font-weight", 400)
            .attr("fill", (d) => this.scaleColor(d.entityName))
            .text((d) => d.entityName);
        return this.chartContainer.node();
    }
}
