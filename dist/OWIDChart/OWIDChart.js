import * as d3 from 'd3';
import * as _ from 'lodash';
import { baseCSS } from './OWIDChartCSS';
import { config } from './OWIDChartConfig';
export class OWIDChart {
    _data = [];
    _marginTop = config.marginTop;
    _marginBottom = config.marginBottom;
    _marginLeft = config.marginLeft;
    _marginRight = config.marginRight;
    _heightTotal = config.heightTotal;
    _widthTotal = config.widthTotal;
    /** _height / _width refer to internal visualization area (<g> maincontainer within <svg>) */
    _height;
    _width;
    _unit;
    _className;
    _valuesRange;
    _dimensions;
    _scaleColor;
    _chartContainer;
    _mainContainer;
    _chartSVG;
    _toolTip;
    _colorScale;
    _chartContent;
    _x;
    _y;
    constructor(data, options) {
        this._data = data;
        this._widthTotal = (options && options.width) || this._widthTotal;
        this._heightTotal = (options && options.height) || this._heightTotal;
        this._marginTop = (options && options.marginTop) || this._marginTop;
        this._marginBottom = (options && options.marginBottom) || this._marginBottom;
        this._marginLeft = (options && options.marginLeft) || this._marginLeft;
        this._marginTop = (options && options.marginTop) || this._marginTop;
        // Redefine main visialization height / width according to current total heigh/width and margins
        this._height = this._heightTotal - this._marginBottom - this._marginTop;
        this._width = this._widthTotal - this._marginLeft - this._marginRight;
        this._y = (options && options.y) || {};
        this._x = (options && options.x) || {};
        this._unit = (options && options.unit) || "";
        this._className = "owidChart";
        this._unit = (options && options.unit) || "";
        this._valuesRange = d3.extent(this._data, (d) => d.value);
        this._dimensions = {
            years: (options && options.years) || this.getDimensionValues("year"),
            entities: (options && options.enitites) || this.getDimensionValues("entityName")
        };
        this._scaleColor = d3.scaleOrdinal(config.colorScheme);
        this._chartContainer = d3
            .create("div")
            .attr("class", "chartContainer")
            .attr("style", "position: relative; clear: both;");
        this._chartSVG = this._chartContainer
            .append("svg");
        /*this._mainContainer = this._chartSVG
          .append("g")
          .attr("class", "container")*/
        this._mainContainer = this._chartSVG.append("g");
        this.setupSVGElements();
        this.baseStartupSettings();
    }
    setupSVGElements() {
        this._chartSVG
            .attr("class", this._className)
            .attr("fill", "currentColor")
            .attr("font-family", "system-ui, sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "middle")
            .attr("width", this._widthTotal)
            .attr("height", this._heightTotal)
            .attr("viewBox", `0 0 ${this._widthTotal} ${this._heightTotal}`)
            .call((svg) => svg.append("style").text(this.css()));
        /*.call((svg:any) =>
          svg
            .append("rect")
            .attr("class","bgLayer")
            .attr("width", this._widthTotal)
            .attr("height", this._heightTotal)
            .attr("fill", "white")
        );*/
        // If it does not already exists, we add a <g> element that will be the main container
        this._mainContainer
            /*= this._chartSVG.selectAll("g.container")
              .data([null])  // we will use D3 data joins to create a single instance of the element
              .join("g")*/
            .attr("class", "container")
            .attr("transform", `translate(${this._marginLeft}, ${this._marginTop})`)
            .call((g) => g
            .append("rect")
            .attr("class", "backgroundLayer")
            .attr("width", this._width)
            .attr("height", this._height)
            .attr("fill", "white"))
            .call((g) => g
            .append("g")
            .attr("class", "axis x")
            .attr("transform", `translate(${0}, ${this._height})`))
            .call((g) => g
            .append("g")
            .attr("class", "axis y")
            .attr("transform", `translate(0,0)`));
    }
    /**
     * startupSettings()
     * Updated charts internat height / width dimensons based on current margins
     *
     * This fucntion can / should be called after there has been a change in configurations (e.g. width)
     */
    baseStartupSettings() {
        this._chartSVG
            .attr("width", this._widthTotal)
            .attr("height", this._heightTotal)
            .attr("viewBox", `0 0 ${this._widthTotal} ${this._heightTotal}`);
        this._chartSVG
            .select("rect.bgLayer")
            .attr("width", this._widthTotal)
            .attr("height", this._heightTotal);
        this._chartSVG
            .select("g.container")
            .attr("transform", `translate(${this._marginLeft}, ${this._marginTop})`);
        this._chartSVG
            .select("g.container")
            .select("rect.backgroundLayer")
            .attr("width", this._width)
            .attr("height", this._height);
        this._chartSVG
            .select("g.container")
            .select("g.axis.x")
            .attr("transform", `translate(${0}, ${this._height})`);
        // Redefine main visialization height / width according to current total heigh/width and margins
        this._height = this._heightTotal - this._marginBottom - this._marginTop;
        this._width = this._widthTotal - this._marginLeft - this._marginRight;
        // Applies new left margin to our chart main <g> container
        this._chartContainer.select("svg")
            .select("g.container")
            .attr("transform", `translate(${this._marginLeft}, ${this._marginTop})`);
        this._chartContainer.select("svg")
            .select("g.container")
            .select("rect.backgroundLayer")
            .attr("width", this._width)
            .attr("height", this._height);
        this._chartContainer.select("svg")
            .select("g.axis.x")
            .attr("transform", `translate(${0}, ${this._height})`);
    }
    startupSettings() {
        this.baseStartupSettings();
    }
    /**
   * Gets / sets the data source
   * @param data
   * @returns current data | current OWIDBarChart object
   */
    data(data) {
        if (arguments.length) {
            this._data = data;
            this.startupSettings();
            this.render();
            return this;
        }
        else {
            return this._data;
        }
    }
    /**
     * Gets / sets the total chart width
     * @param width
     * @returns current width | current OWIDBarChart object
     */
    width(width) {
        if (arguments.length) {
            this._widthTotal = width;
            this.startupSettings();
            this.render();
            return this;
        }
        else {
            return this._widthTotal;
        }
    }
    /**
     * Gets / sets the unit associated to values in our data
     * @param unit
     * @returns current unit | current OWIDBarChart object
     */
    unit(unit) {
        if (arguments.length) {
            this._unit = unit;
            this.startupSettings();
            this.render();
            return this;
        }
        else {
            return this._unit;
        }
    }
    /**
     * Gets / sets the option for
     * @param options
     * @returns current unit | current OWIDBarChart object
     */
    x(options) {
        if (arguments.length) {
            this._x = options;
            this.startupSettings();
            this.render();
            return this;
        }
        else {
            return this._x;
        }
    }
    /**
   * Gets / sets the option for
   * @param options
   * @returns current unit | current OWIDBarChart object
   */
    y(options) {
        if (arguments.length) {
            this._y = options;
            this.startupSettings();
            this.render();
            return this;
        }
        else {
            return this._y;
        }
    }
    getDimensionValues(dimension) {
        return _.chain(this._data)
            .map((d) => d[dimension])
            .uniq()
            .value();
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
    render() {
    }
    node() {
        return this._chartContainer.node();
    }
    css() {
        return baseCSS;
    }
}
