import * as d3 from 'd3';
import * as _ from 'lodash';
import { OWIDChart } from '../OWIDChart/OWIDChart';
import { OWIDTrendChartTooltip } from "./OWIDTrendChartTooltip";
import { config } from './OWIDTrendChartConfig';
/**
 * Creates a line chart that shows the evolution of values on tine (years)
 *
 * For each entity we create a new series
 *
 * There is a marker that higights all points in a specific year (shown on mouse movement)
 *
 * There is a tooltip that displays values for all entities on a given year
 */
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
    /**
     * Creates a new trendChart (line chart with years in the x Axis and values in the y Axis)
     *
     * It is an extention of the OWIDChart class which creates a <svg> wrapped inside a <div> element
     *
     * .node() method returns the <div> wrapper, which can be appended to existing DOM elements
     *
     * Any OWIDChart instance has confuguration functions that,once called, will create a new rendering of the visualization
     *
     * .data([]) dataset to be used in the visualization
     * .width(number) total width of the chart
     * .unit(string) unit descriptor ("years" | "people" ...)
     * .x(options) options for the x Axis (e.g. {grid:true})
     * .y(options) options for the x Axis (e.g. {grid:true})
     *
     * @param data collection of {year:number; entityName:string, value:number} objects that will be used to render the visualization
     * @param options optional initial configuration options {marginLeft:number; merginRight:number; selectedYearCallBack:function}
     */
    constructor(data, options) {
        super(data, options);
        /**
         * We optain the collection of valid years and entityNames from the given data
         */
        this._dimensions = {
            years: this.getDimensionValues("year"),
            entities: this.getDimensionValues("entityName")
        };
        /**
         * Margins are defined around the <g> main container to allow space for titles, axes and entity labels
         */
        this._marginLeft = options && options.marginLeft;
        this._marginRight = options && options._marginRight;
        this._marginLeft =
            (options && options.marginLeft) || this.calculateMarginLeft();
        this._marginRight =
            (options && options.marginRight) || this.calculateMarginRight();
        /**
         * Callback that is called with a year parameter whenever the users hovers over a new year location on the chart
         */
        this._selectedYearCallback = options && options.selectedYearCallback || function () { };
        /**
         * We create a tooltip (<div> element) that will be appended to the charts main <div> container
         */
        this._toolTip = new OWIDTrendChartTooltip({ colorScale: this._colorScale, containerWidth: this._width });
        this._mainDivContainer.node().appendChild(this._toolTip.render().node());
        /**
         * We configure supporting data and objects (margins, width, height, scales, axes, series,... ) and
         * then we render the visual elements for the visualization
         */
        this.startupSettings();
        this.render();
    }
    /**
     * Configures / updates supporting data and objects (margins, width, height, scales, axes, series,... ) that
     * will be used for the visualization rendering
     *
     * This method should be called each time we update configurations that will affect the chart rendering
     * (e.g. after calling .data(), witdh(), ...)
     */
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
    /**
     * Renders the visual elements of the chart inside the main <g> container
     *
     * Most of the DOM management is done using D3js
     */
    render() {
        const self = this;
        // Capture mouse events on background rect
        this._mainContainer
            .select("rect.backgroundLayer")
            .on("mousemove", function (e, d) { self.handleMouseMove(e, d, this); })
            .on("mouseleave", function (e, d) { self.handleMouseLeave(e, d, this); });
        /**
         * Calculate the range of years (e.g. [1960, 2015]) and rangeValues (e.g. [49.5, 81.3] from data records
         *
         * These ranges are used to define scale domains
         */
        const rangeYears = d3.extent(this._years);
        const rangeValues = d3.extent(this._values);
        this._scaleX.domain(rangeYears);
        this._scaleY.domain(rangeValues);
        /**
         * We update the rendering of x / y axis
         */
        this._mainContainer.select("g.axis.x").call(this._axisX);
        this._mainContainer.select("g.axis.y").call(this._axisY);
        /**
         * If not already created, we create a <g> element that will include tha actual lines for the line chart
         */
        const chartContainer = this._mainContainer.selectAll("g.lineChartContainer")
            .data([null])
            .join("g")
            .attr("class", "lineChartContainer");
        /**
         * line builder that generates a path definition given a set of datapoints
         */
        const line = d3
            .line()
            .x((d) => this._scaleX(d.year))
            .y((d) => this._scaleY(d.value));
        /**
         * We create a <g> element for each serie (each <g> contains the line associated an entity)
         */
        const series = chartContainer
            .selectAll("g.serie")
            .data(this._seriesData, (d) => d.name)
            .join("g")
            .attr("class", (d) => `serie ${d.name}`);
        /**
         * We create the actual line (a <path> element) for each series
         */
        series
            .selectAll("path")
            .data((d) => [d.data])
            .join("path")
            .attr("d", (d) => line(d))
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("stroke", (d) => this._scaleColor(d[0].entityName));
        /**
         * We add a dot <circle> for each datapoint
         */
        series
            .selectAll("circle.dot")
            .data((d) => d.data)
            .join("circle")
            .attr("class", "dot")
            .attr("fill", (d) => this._scaleColor(d.entityName))
            .attr("cx", (d) => this._scaleX(d.year))
            .attr("cy", (d) => this._scaleY(d.value))
            .attr("r", 2);
        /**
         * All series labels (displayed at the end of the line on the right margin) will be displayes in a
         * <g> element
         *
         * In teh future we need to deal with the overlapping of labels
         */
        const entitiesNames = series
            .selectAll("g.entitiesNames")
            .data((d) => [_.last(d.data)])
            .join("g")
            .attr("class", "entitiesNames")
            .attr("transform", (d) => `translate(${this._scaleX(this._maxYear)},${this._scaleY(d.value)})`);
        /**
         * We display the actual text for each series label (usually coutry names)
         */
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
    /**
     * We display a "marker" which is a vertical line gor a given year
     *
     * All the dapapoints in the respective year will be highlighted with a higher radious
     *
     * @param year
     */
    showMarker(year) {
        /**
         * We change the dot size accordingly
         */
        this._mainContainer
            .selectAll("g.serie")
            .selectAll("circle.dot")
            .attr("r", (d) => d.year == year ? config.dotSizeHighlighted : config.dotSizeUnhighlighted);
        /**
         * We display a new vertical line assocciated to the given year
         */
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
    /**
     * We hide the markes (all dots go back to normal size and marker line is removed)
     */
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
    /**
     * Handles visualization behaviour when the user moves the mouse on the chart
     *
     * We display a marker and a tooltip associated to the given year
     *
     * @param e event associated to the mouse movement
     * @param d data associated to the element that triggered the event
     * @param el   DOM element of the eleemnt that triggered the event
     */
    handleMouseMove(e, d, el) {
        /**
         * mouse coordinates are captured relative to the target (<g> main container) or to the main <div> container
         *
         * We use the coordinates relative ot main container to display the tooltip <div>
         */
        const pos_relTarget = d3.pointer(e);
        const pos_relContainer = d3.pointer(e, this._mainDivContainer);
        /**
         * We identifye the closest year relative to the target position
         * and we display a marker for that year
         */
        const selectedYear = this.getClosestYear(pos_relTarget[0]);
        this.showMarker(selectedYear);
        /**
         * For tooltip data we find the datapoint associated to the respective year for each serie (entity)
         */
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
        /**
         * callback funtion is called with the selected year
         */
        this._selectedYearCallback(selectedYear);
    }
    /**
     * Handle visualization behaviour when the user moves the mouse out the cghart region
     *
     * We hide marker and tooltip
     *
     * @param e event associated to the mouse movement
     * @param d data associated to the element that triggered the event
     * @param el DOM element of the eleemnt that triggered the event
     */
    handleMouseLeave(e, d, el) {
        this._chartContent && this._chartContent.hideMarker();
        this._toolTip.hide();
    }
    /**
     * We need to accomodate enough space on the left margin for the y axis ticks
     *
     * We estiemate the max width of the text for all ticks values and the unit descriptor
     *
     * @returns width Estimated margin space needed
     */
    calculateMarginLeft() {
        const axisScale = this._axisY.scale();
        const values = axisScale.ticks();
        const tickContent = values.map((d) => `${d} ${this._unit}`);
        const tickSizes = tickContent.map((d) => this.getTextWidth(d, 16.2, "sans-serif"));
        const maxSize = _.max(tickSizes);
        return maxSize * 1.5 || 10;
    }
    /**
     * We need to accomodate enough space on the right margin for the entities labels
     *
     * We estimate the max width of the text for all ticks values and the unit descriptor
     *
     * @returns witdh Estimated margin space needed
     */
    calculateMarginRight() {
        const entityNames = this._dimensions.entities;
        const legendContent = entityNames.map((d) => `${d}`);
        const legendSized = legendContent.map((d) => this.getTextWidth(d, 16.2, "sans-serif"));
        const maxSize = _.max(legendSized);
        return maxSize * 1.5 || 10;
    }
    /**
     * We show a grid (lines on the chart) associated to each X tick
     */
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
    /**
     * We show a grid (lines on the chart) associated to each Y tick
     */
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
    /**
     * Given an x position on the chart, we estimate the closest year asociated to such position
     *
     * @param posX
     * @returns
     */
    getClosestYear(posX) {
        const closestYear = this._dimensions.years.find((d) => d == Math.round(this._scaleX.invert(posX)));
        return closestYear;
    }
    /**
     * Gets the chart <div> element
     *
     * @returns <div> element
     */
    node() {
        return this._mainDivContainer.node();
    }
}
