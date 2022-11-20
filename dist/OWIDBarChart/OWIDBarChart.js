import * as d3 from 'd3';
import * as _ from 'lodash';
import { OWIDChart } from '../OWIDChart/OWIDChart';
import { OWIDBarChartTooltip } from "./OWIDBarChartTooltip";
import { config } from './OWIDBarChartConfig';
import { inlineCSS } from "./OWIDBarChartCSS";
/**
 * Creates a horizontal bar chart with values associated to each entity for a given year
 *
 */
export class OWIDBarChart extends OWIDChart {
    _scaleX;
    _scaleY;
    _axisX;
    _axisY;
    _year;
    _latestYear;
    _entities = [];
    _singleYearData;
    _maxValue;
    /**
      * Creates a new barChart (horizontal bar chart with entities on the Yaxis and values on the X Axis)
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
        this._year = options && options.year;
        // For barchart we overwrite the default marginBottom fo give more space for x axis
        this._marginBottom = config.marginBottom;
        this._toolTip = new OWIDBarChartTooltip({ colorScale: this._colorScale, containerWidth: this._width });
        this._mainDivContainer.node().appendChild(this._toolTip.render().node());
        // Create X/Y scales and axis
        this._scaleX = d3.scaleLinear();
        this._scaleY = d3.scaleBand();
        this._axisX = d3.axisBottom(this._scaleX);
        this._axisY = d3.axisLeft(this._scaleY);
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
        /**
         * Bar charts will focus on multiple values for a single year
         *
         * If the year has been specified in options ({year: 2020}) or via the year function( .year(2020)) we will use
         * the specified year to filter the data to be plotted.
         *
         * If the year has not been specified, we will use the latest year in the data
         */
        this._latestYear = _.chain(this._data).map((d) => d.year).max().value();
        this._year = this._year || this._latestYear;
        /** _singleYearData is the dataset we use for building the Chart */
        this._singleYearData = this._data.filter((d) => d.year == this._year);
        // Update the overal <svg> & <g> main container dimensiosn and positions in case with / margings have been changed
        super.baseStartupSettings();
        /** _entities is used to configure our Y Scale domain */
        this._entities = _.chain(this._singleYearData)
            .sortBy(d => d.value)
            .map(d => d.entityName)
            .uniq()
            .value();
        /** _maxValue is used to configure our X Scale domain */
        this._maxValue = _.chain(this._singleYearData)
            .map(d => d.value)
            .max()
            .value();
        /** Configure X/Y scales */
        this._scaleX.range([0, this._width])
            .domain([0, this._maxValue]);
        this._scaleY.padding(config.barsPadding)
            .range([this._height, 0])
            .domain(this._entities);
        /** Modify ticks & format for X Axis using the specified 'unit'*/
        this._axisX.ticks(10)
            .tickFormat((d) => `${d} ${this._unit}`);
        // Update left/right margin depending on the actual length on entitynames & values
        this._marginLeft = this.calculateMarginLeft() > this._marginLeft
            ? this.calculateMarginLeft()
            : this._marginLeft;
        this._marginRight = this.calculateMarginRight() > this._marginRight
            ? this.calculateMarginRight()
            : this._marginRight;
        // Update the overal <svg> & <g> main container dimensions and positions
        super.baseStartupSettings();
        // Update scales ranges in case that left /right margins have been modified
        this._scaleX.range([0, this._width]);
    }
    /**
     * Renders the visual elements of the chart inside the main <g> container
     *
     * Most of the DOM management is done using D3js
     */
    render() {
        // Main container is the <g> element where we will displayi our chart
        const mainContainer = this._mainDivContainer.select("svg").select("g.container");
        /** render x/y axes */
        mainContainer.select("g.axis.x").call(this._axisX);
        mainContainer.select("g.axis.y").call(this._axisY);
        // Display gridlines if specified
        if (this._x && this._x.grid) {
            this.showGridX();
        }
        // Add bars associated to each entity for the given year
        const bars = mainContainer
            .selectAll("rect.entity")
            .data(this._singleYearData, (d) => d.entityName)
            .join("rect")
            .attr("class", "entity")
            .attr("fill", "cyan")
            .attr("y", (d) => d.entityName && this._scaleY(d.entityName))
            .attr("height", this._scaleY.bandwidth())
            .attr("width", (d) => this._scaleX(d.value));
        // Add text labels at the end of each bar
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
        // Add <style> with CSS local to our chart container
        this._mainDivContainer.selectAll("style")
            .data([null])
            .join("style")
            .text(inlineCSS);
    }
    /**
     * Gets / sets the year that is a target for our data
     * @param year
     * @returns
     */
    year(year) {
        if (arguments.length) {
            this._year = year;
            this.startupSettings();
            this.render();
            return this;
        }
        else {
            return this._year;
        }
    }
    // Auxiliary functions
    /**
     * We need to accomodate enough space on the left margin for the y axis ticks
     *
     * We estiemate the max width of the text for all ticks values and the unit descriptor
     *
     * @returns width Estimated margin space needed
     */
    calculateMarginLeft() {
        const axisScale = this._axisY.scale();
        const values = axisScale.domain();
        const tickContent = values.map((d) => `${d}`);
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
    /**
     * Gets the chart <div> element
     *
     * @returns <div> element
     */
    node() {
        return this._mainDivContainer.node();
    }
}
