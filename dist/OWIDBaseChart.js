import * as d3 from 'd3';
import * as _ from 'lodash';
import { baseCSS } from './OWIDBaseChartCSS';
import { config } from './OWIDBaseChartConfig';
export class OWIDBaseChart {
    data = [];
    height;
    width;
    marginTop = config.marginTop;
    marginBottom = config.marginBottom;
    marginLeft = config.marginLeft;
    marginRight = config.marginRight;
    heightTotal = config.heightTotal;
    widthTotal = config.widthTotal;
    unit;
    className;
    valuesRange;
    dimensions;
    scaleColor;
    chartContainer;
    chartSVG;
    toolTip;
    colorScale;
    chartContent;
    x;
    y;
    constructor(data, options) {
        this.data = data;
        this.widthTotal = (options && options.width) || this.widthTotal;
        this.heightTotal = (options && options.height) || this.heightTotal;
        this.marginTop = (options && options.marginTop) || this.marginTop;
        this.marginBottom = (options && options.marginBottom) || this.marginBottom;
        this.marginLeft = (options && options.marginLeft) || this.marginLeft;
        this.marginTop = (options && options.marginTop) || this.marginTop;
        this.height = this.heightTotal - this.marginBottom - this.marginTop;
        this.width = this.widthTotal - this.marginLeft - this.marginRight;
        this.y = (options && options.y) || {};
        this.x = (options && options.x) || {};
        this.unit = (options && options.unit) || "";
        this.className = "owidChart";
        this.unit = (options && options.unit) || "";
        this.valuesRange = d3.extent(this.data, (d) => d.value);
        this.dimensions = {
            years: (options && options.years) || this.getDimensionValues("year"),
            entities: (options && options.enitites) || this.getDimensionValues("entityName")
        };
        this.scaleColor = d3.scaleOrdinal(config.colorScheme);
        this.chartContainer = d3
            .create("div")
            .attr("class", "chartContainer")
            .attr("style", "position: relative; clear: both;");
        this.chartSVG = this.chartContainer
            .append("svg");
        this.chartContainer
            .append("div")
            .attr("class", "tooltipContainer");
        this.setupSVGElements(this.chartSVG);
    }
    setupSVGElements(svg) {
        svg
            .attr("class", this.className)
            .attr("fill", "currentColor")
            .attr("font-family", "system-ui, sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "middle")
            .attr("width", this.widthTotal)
            .attr("height", this.heightTotal)
            .attr("viewBox", `0 0 ${this.widthTotal} ${this.heightTotal}`)
            .call((svg) => svg.append("style").text(this.css()))
            .call((svg) => svg
            .append("rect")
            .attr("width", this.widthTotal)
            .attr("height", this.heightTotal)
            .attr("fill", "white"));
        const mainContainer = svg
            .append("g")
            .attr("class", "container")
            .attr("transform", `translate(${this.marginLeft}, ${this.marginTop})`)
            .call((g) => g
            .append("rect")
            .attr("class", "backgroundLayer")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("fill", "white"))
            .call((g) => g
            .append("g")
            .attr("class", "axis x")
            .attr("transform", `translate(${0}, ${this.height})`))
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
     * updateDimensions
     * Updated charts internat height / width dimensons based on current margins
     */
    updateDimensions() {
        // Applies new left margin to our chart main <g> container
        this.chartContainer.select("svg")
            .select("g.container")
            .attr("transform", `translate(${this.marginLeft}, ${this.marginTop})`);
        this.chartContainer.select("svg")
            .select("g.container")
            .select("rect.backgroundLayer")
            .attr("width", this.width)
            .attr("height", this.height);
        this.chartContainer.select("svg")
            .select("g.axis.x")
            .attr("transform", `translate(${0}, ${this.height})`);
    }
    handleMouseMove(e) {
        const pos_relTarget = d3.pointer(e);
        const pos_relContainer = d3.pointer(e, this.chartContainer);
    }
    handleMouseLeave() {
        this.chartContent && this.chartContent.hideMarker();
    }
    getDimensionValues(dimension) {
        return _.chain(this.data)
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
        return this.chartContainer.node();
    }
    css() {
        return baseCSS;
    }
}
