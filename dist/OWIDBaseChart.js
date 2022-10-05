import * as d3 from 'd3';
import * as _ from 'lodash';
import { baseCSS } from './OWIDBaseChartCSS';
import { config } from './OWIDBaseChartConfig';
export class OWIDBaseChart {
    _data = [];
    _height;
    _width;
    _marginTop = config.marginTop;
    _marginBottom = config.marginBottom;
    _marginLeft = config.marginLeft;
    _marginRight = config.marginRight;
    _heightTotal = config.heightTotal;
    _widthTotal = config.widthTotal;
    _unit;
    _className;
    _valuesRange;
    _dimensions;
    _scaleColor;
    _chartContainer;
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
        this._chartContainer
            .append("div")
            .attr("class", "tooltipContainer");
        this.setupSVGElements(this._chartSVG);
    }
    setupSVGElements(svg) {
        svg
            .attr("class", this._className)
            .attr("fill", "currentColor")
            .attr("font-family", "system-ui, sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "middle")
            .attr("width", this._widthTotal)
            .attr("height", this._heightTotal)
            .attr("viewBox", `0 0 ${this._widthTotal} ${this._heightTotal}`)
            .call((svg) => svg.append("style").text(this.css()))
            .call((svg) => svg
            .append("rect")
            .attr("width", this._widthTotal)
            .attr("height", this._heightTotal)
            .attr("fill", "white"));
        // If it does not already exists, we add a <g> element that will be the main container
        const mainContainer = svg.selectAll("g.container")
            .data([null]) // we will use D· data joins to create a single instance of the element
            .join("g")
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
        mainContainer
            .select("rect.backgroundLayer")
            .on("mousemove", (e) => this.handleMouseMove(e))
            .on("mouseleave", () => this.handleMouseLeave());
        return svg;
    }
    /**
     * updateSizeAndMargins
     * Updated charts internat height / width dimensons based on current margins
     */
    updateSizeAndMargins() {
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
    handleMouseMove(e) {
        const pos_relTarget = d3.pointer(e);
        const pos_relContainer = d3.pointer(e, this._chartContainer);
    }
    handleMouseLeave() {
        this._chartContent && this._chartContent.hideMarker();
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
        return this._chartContainer.node();
    }
    css() {
        return baseCSS;
    }
}
