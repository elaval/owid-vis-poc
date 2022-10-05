import * as d3 from 'd3';
import * as _ from 'lodash';
import { OWIDBaseChart } from '../OWIDBaseChart';
import { OWIDBarChartTooltip } from "./OWIDBarChartTooltip";
import { config } from './OWIDBarChartConfig';
import { inlineCSS } from "./OWIDBarChartCSS";
export class OWIDBarChart extends OWIDBaseChart {
    _scaleX = d3.scaleLinear();
    _scaleY = d3.scaleBand();
    _axisX = d3.axisBottom(this._scaleX);
    _axisY = d3.axisLeft(this._scaleY);
    _year;
    _latestYear;
    _entities = [];
    _singleYearData;
    _maxValue;
    constructor(data, options) {
        super(data, options);
        this._year = options && options.year;
        this._toolTip = new OWIDBarChartTooltip({ colorScale: this._colorScale, containerWidth: this._width });
        this._chartContainer.node().appendChild(this._toolTip.render().node());
        this.startupSettings();
        this.render();
    }
    startupSettings() {
        this._latestYear = _.chain(this._data).map((d) => d.year).max().value();
        this._year = this._year || this._latestYear;
        this._singleYearData = this._data.filter((d) => d.year == this._year);
        this._marginBottom = config.marginBottom;
        this._height = this._heightTotal - this._marginTop - this._marginBottom;
        this._valuesRange = d3.extent(this._data, (d) => d.value);
        this._entities = _.chain(this._singleYearData)
            .sortBy(d => d.value)
            .map(d => d.entityName)
            .uniq()
            .value();
        this._maxValue = _.chain(this._singleYearData)
            .map(d => d.value)
            .max()
            .value();
        this._scaleX = d3.scaleLinear()
            .range([0, this._width])
            .domain([0, this._maxValue]);
        this._scaleY = d3
            .scaleBand()
            .padding(config.barsPadding)
            .range([this._height, 0])
            .domain(this._entities);
        this._axisX = d3.axisBottom(this._scaleX)
            .ticks(10)
            .tickFormat((d) => `${d} ${this._unit}`);
        this._axisY = d3
            .axisLeft(this._scaleY);
        // Update left/right margin depending on the length on entitynames & values
        this._marginLeft = this.calculateMarginLeft() > this._marginLeft
            ? this.calculateMarginLeft()
            : this._marginLeft;
        this._marginRight = this.calculateMarginRight() > this._marginRight
            ? this.calculateMarginRight()
            : this._marginRight;
        // Adjust width according to new margins
        this._width = this._widthTotal - this._marginLeft - this._marginRight;
        // Update dimensions of <svg> inner elements according to updated margins & witdh
        super.updateSizeAndMargins();
        // Update scales ranges
        this._scaleX.range([0, this._width]);
        this._scaleY.range([this._height, 0]);
        if (this._y && this._y.grid) {
            this.showGridY();
        }
        if (this._x && this._x.grid) {
            this.showGridX();
        }
    }
    render() {
        // Main container is the <g> element where we will displayi our chart
        const mainContainer = this._chartContainer.select("svg").select("g.container");
        // We handle events for mouse interaction on the main container
        mainContainer
            .select("rect.backgroundLayer")
            .on("mousemove", (e) => this.handleMouseMove(e))
            .on("mouseleave", () => this.handleMouseLeave());
        // Add bars associated to each entity for teh given year
        const bars = mainContainer
            .selectAll("rect.entity")
            .data(this._singleYearData, (d) => d.entityName)
            .join("rect")
            .attr("class", "entity")
            .attr("fill", "cyan")
            .attr("y", (d) => d.entityName && this._scaleY(d.entityName))
            .attr("height", this._scaleY.bandwidth())
            .attr("width", (d) => this._scaleX(d.value));
        const text = mainContainer
            .selectAll("text.value")
            .data(this._singleYearData, (d) => d.entityName)
            .join("text")
            .attr("class", "value barLabel")
            .attr("x", (d) => this._scaleX(d.value))
            .attr("y", (d) => d.entityName && this._scaleY(d.entityName))
            .attr("dy", this._scaleY.bandwidth() / 2 + config.valueFontSize / 2)
            .attr("dx", config.textValueDx)
            .attr("font-size", config.valueFontSize)
            .attr("text-anchor", "start")
            .text((d) => `${d.value} ${this._unit}`);
        this._chartContainer.selectAll("style")
            .data([null])
            .join("style")
            .text(inlineCSS);
        mainContainer.select("g.axis.x").call(this._axisX);
        mainContainer.select("g.axis.y").call(this._axisY);
        return this.node();
    }
    year(year) {
        this._year = year;
        this.startupSettings();
        this.render();
        return this;
    }
    handleMouseMove(e) {
    }
    handleMouseLeave() {
    }
    // Auxiliary functions
    getDimensionValues(dimension) {
        return _.chain(this._data)
            .map((d) => d[dimension])
            .uniq()
            .value();
    }
    calculateMarginLeft() {
        const axisScale = this._axisY.scale();
        const values = axisScale.domain();
        const tickContent = values.map((d) => `${d}`);
        const tickSizes = tickContent.map((d) => this.getTextWidth(d, 16.2, "sans-serif"));
        const maxSize = _.max(tickSizes);
        return maxSize * 1.5 || 10;
    }
    calculateMarginRight() {
        const entityNames = this._dimensions.entities;
        const legendContent = entityNames.map((d) => `${d}`);
        const legendSized = legendContent.map((d) => this.getTextWidth(d, 16.2, "sans-serif"));
        const maxSize = _.max(legendSized);
        return maxSize * 1.5 || 10;
    }
    getTextWidth(text, fontSize, fontFace) {
        const canvas = document.createElement("canvas"), context = canvas.getContext("2d");
        let textWidth = null;
        if (context) {
            context.font = fontSize + "px " + fontFace;
            textWidth = context.measureText(text).width;
        }
        return textWidth;
    }
    showGridX() {
        const axisScale = this._axisX.scale();
        const gridValues = axisScale.ticks();
        const gridContainer = this._chartSVG.select("g.container").selectAll("g.grid.x")
            .data([null])
            .join("g")
            .attr("class", "grid x");
        gridContainer
            .selectAll("line")
            .data(gridValues)
            .join("line")
            .attr("class", "grid x")
            .attr("x1", (d) => this._scaleX(d))
            .attr("x2", (d) => this._scaleX(d))
            .attr("y1", 0)
            .attr("y2", this._height)
            .attr("stroke-dasharray", "3,2")
            .attr("stroke-width", 1)
            .attr("stroke", "lightgrey");
    }
    showGridY() {
    }
    getClosestYear(posX) {
        const closestYear = this._dimensions.years.find((d) => d == Math.floor(this._scaleX.invert(posX)));
        return closestYear;
    }
    node() {
        return this._chartContainer.node();
    }
}
