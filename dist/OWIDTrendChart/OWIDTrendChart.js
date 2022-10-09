import * as d3 from 'd3';
import * as _ from 'lodash';
import { OWIDChart } from '../OWIDChart/OWIDChart';
import { OWIDTrendChartTooltip } from "./OWIDTrendChartTooltip";
import { config } from './OWIDTrendChartConfig';
export class OWIDTrendChart extends OWIDChart {
    _scaleX = d3.scaleLinear();
    _scaleY = d3.scaleLinear();
    _axisX = d3.axisBottom(this._scaleX);
    _axisY = d3.axisLeft(this._scaleY);
    _seriesData = [];
    _selectedYearCallback;
    _years = [];
    _values = [];
    _maxYear;
    constructor(data, options) {
        super(data, options);
        this._dimensions = {
            years: (options && options.years) || this.getDimensionValues("year"),
            entities: (options && options.enitites) || this.getDimensionValues("entityName")
        };
        this._marginLeft = options && options.marginLeft;
        this._marginRight = options && options._marginRight;
        this._marginLeft =
            (options && options.marginLeft) || this.calculateMarginLeft();
        this._marginRight =
            (options && options.marginRight) || this.calculateMarginRight();
        this._selectedYearCallback = options && options.selectedYearCallback || function () { };
        this._toolTip = new OWIDTrendChartTooltip({ colorScale: this._colorScale, containerWidth: this._width });
        this._chartContainer.node().appendChild(this._toolTip.render().node());
        this.startupSettings();
        this.render();
    }
    startupSettings() {
        super.baseStartupSettings();
        this._marginBottom = config.marginBottom;
        this._height = this._heightTotal - this._marginTop - this._marginBottom;
        this._valuesRange = d3.extent(this._data, (d) => d.value);
        this._scaleX = d3.scaleLinear().range([0, this._width]);
        this._scaleY = d3
            .scaleLinear()
            .range([this._height, 0])
            .domain(this._valuesRange);
        this._axisX = d3.axisBottom(this._scaleX).ticks(10, "d");
        this._axisY = d3
            .axisLeft(this._scaleY)
            .ticks(10)
            .tickFormat((d) => `${d} ${this._unit}`);
        // Update left/right margin depending on the length on entitynames & values
        this._marginLeft = this.calculateMarginLeft() > this._marginLeft
            ? this.calculateMarginLeft()
            : this._marginLeft;
        this._marginRight = this.calculateMarginRight() > this._marginRight
            ? this.calculateMarginRight()
            : this._marginRight;
        // Adjust width according to new margins
        this._width = this._widthTotal - this._marginLeft - this._marginRight;
        this._width = this._widthTotal - this._marginLeft - this._marginRight;
        super.baseStartupSettings();
        this._scaleX.range([0, this._width]);
        this._scaleY.range([this._height, 0]);
        this._seriesData = _.chain(this._data)
            .groupBy((d) => d.entityName)
            .map((items, entityName) => ({ name: entityName, data: items }))
            .value();
        if (this._y && this._y.grid) {
            this.showGridY();
        }
        if (this._x && this._x.grid) {
            this.showGridX();
        }
        this._years = _.chain(this._data)
            .map((d) => d.year)
            .uniq()
            .value();
        this._values = _.chain(this._data)
            .map((d) => d.value)
            .uniq()
            .value();
        this._maxYear = _.max(this._years);
        this._seriesData = _.chain(this._data)
            .groupBy((d) => d.entityName)
            .map((items, entityName) => ({ name: entityName, data: items }))
            .value();
    }
    render() {
        // Main <g> container where we display the visual elements
        const mainContainer = this._chartContainer.select("svg").select("g.container");
        // Capture mouse events on background rect
        mainContainer
            .select("rect.backgroundLayer")
            .on("mousemove", (e) => this.handleMouseMove(e))
            .on("mouseleave", () => this.handleMouseLeave());
        const rangeYears = d3.extent(this._years);
        const rangeValues = d3.extent(this._values);
        this._scaleX.domain(rangeYears);
        this._scaleY.domain(rangeValues);
        mainContainer.select("g.axis.x").call(this._axisX);
        mainContainer.select("g.axis.y").call(this._axisY);
        const chartContainer = mainContainer.selectAll("g.lineChartContainer")
            .data([null])
            .join("g")
            .attr("class", "lineChartContainer");
        const line = d3
            .line()
            .x((d) => this._scaleX(d.year))
            .y((d) => this._scaleY(d.value));
        const series = chartContainer
            .selectAll("g.serie")
            .data(this._seriesData, (d) => d.name)
            .join("g")
            .attr("class", (d) => `serie ${d.name}`);
        const lines = series
            .selectAll("path")
            .data((d) => [d.data])
            .join("path")
            .attr("d", (d) => line(d))
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("stroke", (d) => this._scaleColor(d[0].entityName));
        const dots = series
            .selectAll("circle.dot")
            .data((d) => d.data)
            .join("circle")
            .attr("class", "dot")
            .attr("fill", (d) => this._scaleColor(d.entityName))
            .attr("cx", (d) => this._scaleX(d.year))
            .attr("cy", (d) => this._scaleY(d.value))
            .attr("r", 2);
        const entitiesNames = series
            .selectAll("g.entitiesNames")
            .data((d) => [_.last(d.data)])
            .join("g")
            .attr("class", "entitiesNames")
            .attr("transform", (d) => `translate(${this._scaleX(this._maxYear)},${this._scaleY(d.value)})`);
        entitiesNames
            .selectAll("text")
            .data((d) => [d])
            .join("text")
            .attr("dx", 10)
            .attr("text-anchor", "start")
            .attr("font-size", 12)
            .attr("font-weight", 400)
            .attr("fill", (d) => this._scaleColor(d.entityName))
            .text((d) => d.entityName);
    }
    showMarker(year) {
        this._mainContainer
            .selectAll("g.serie")
            .selectAll("circle.dot")
            .attr("r", (d) => d.year == year ? config.dotSizeHighlighted : config.dotSizeUnhighlighted);
        this._mainContainer
            .selectAll("line.marker")
            .data([year])
            .join("line")
            .attr("class", "marker")
            .attr("y1", this._scaleY.range()[1])
            .attr("y2", this._scaleY.range()[0])
            .attr("x1", this._scaleX(year))
            .attr("x2", this._scaleX(year))
            .attr("stroke", "grey")
            .attr("stroke-width", 1);
    }
    hideMarker() {
        this._mainContainer
            .selectAll("g.serie")
            .selectAll("circle.dot")
            .attr("r", config.dotSizeUnhighlighted);
        this._mainContainer.selectAll("line.marker").remove();
    }
    /**
     * Gets / sets the callback function for selectedYear
     * @param _selectedYearCallback
     * @returns
     */
    selectedYearCallback(callback) {
        if (arguments.length) {
            this._selectedYearCallback = callback;
            return this;
        }
        else {
            return this._selectedYearCallback;
        }
    }
    handleMouseMove(e) {
        const pos_relTarget = d3.pointer(e);
        const pos_relContainer = d3.pointer(e, this._chartContainer);
        const selectedYear = this.getClosestYear(pos_relTarget[0]);
        this.showMarker(selectedYear);
        const tooltipData = _.chain(this._seriesData)
            .map((d) => {
            const yearRecord = d.data.find((d) => d.year == selectedYear);
            return {
                entityName: d.name,
                value: (yearRecord && yearRecord.value) || "NA"
            };
        })
            .sortBy((d) => -d.value)
            .value();
        this._toolTip.show([pos_relContainer[0], this._height * 0.25], {
            year: selectedYear,
            data: tooltipData
        });
        this._selectedYearCallback(selectedYear);
    }
    handleMouseLeave() {
        this._chartContent && this._chartContent.hideMarker();
        this._toolTip.hide();
    }
    getDimensionValues(dimension) {
        return _.chain(this._data)
            .map((d) => d[dimension])
            .uniq()
            .value();
    }
    calculateMarginLeft() {
        const axisScale = this._axisY.scale();
        const values = axisScale.ticks();
        const tickContent = values.map((d) => `${d} ${this._unit}`);
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
        this._chartSVG
            .select("g.container")
            .append("g")
            .attr("class", "grid x")
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
        const axisScale = this._axisY.scale();
        const gridValues = axisScale.ticks();
        this._chartSVG
            .select("g.container")
            .append("g")
            .attr("class", "grid y")
            .selectAll("line")
            .data(gridValues)
            .join("line")
            .attr("class", "grid y")
            .attr("x1", 0)
            .attr("x2", this._width)
            .attr("y1", (d) => this._scaleY(d))
            .attr("y2", (d) => this._scaleY(d))
            .attr("stroke-dasharray", "3,2")
            .attr("stroke-width", 1)
            .attr("stroke", "lightgrey");
    }
    getClosestYear(posX) {
        const closestYear = this._dimensions.years.find((d) => d == Math.round(this._scaleX.invert(posX)));
        return closestYear;
    }
    node() {
        return this._chartContainer.node();
    }
}
