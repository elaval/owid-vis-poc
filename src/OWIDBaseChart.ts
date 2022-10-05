import * as d3 from 'd3';
import * as _ from 'lodash';

import { OWIDTrendChartLines }  from "./OWIDTrendChart/OWIDTrendChartLines";
import { OWIDTrendChartTooltip } from "./OWIDTrendChart/OWIDTrendChartTooltip";
import { baseCSS } from './OWIDBaseChartCSS';

import { config
 } from './OWIDBaseChartConfig';
export class OWIDBaseChart {
  protected _data: [] = [];


  protected _height:number;
  protected _width: number;
  protected _marginTop: number = config.marginTop;
  protected _marginBottom: number = config.marginBottom;
  protected _marginLeft: number = config.marginLeft;
  protected _marginRight: number = config.marginRight;

  protected _heightTotal: number = config.heightTotal;
  protected _widthTotal: number = config.widthTotal;

  protected _unit: String;
  protected _className: string;
  protected _valuesRange: [any, any];
  protected _dimensions: { years: any; entities: any; };
  protected _scaleColor: d3.ScaleOrdinal<string, string, never>;

  protected _chartContainer: d3.Selection<any, undefined, null, undefined>;
  protected _chartSVG: any;
  protected _toolTip: any;
  protected _colorScale: any;
  protected _chartContent: any;

  protected _x: any;
  protected _y: any;

  constructor(data: any, options: any) {
      this._data = data;

      this._widthTotal = (options && options.width) || this._widthTotal;
      this._heightTotal = (options && options.height) || this._heightTotal;

      this._marginTop = (options && options.marginTop) || this._marginTop;
      this._marginBottom = (options && options.marginBottom) || this._marginBottom;
      this._marginLeft = (options && options.marginLeft) || this._marginLeft;
      this._marginTop = (options && options.marginTop) || this._marginTop;

      this._height = this._heightTotal-this._marginBottom- this._marginTop;
      this._width = this._widthTotal-this._marginLeft-this._marginRight;

      this._y = (options && options.y) || {};
      this._x = (options && options.x) || {};

      this._unit = (options && options.unit) || "";
      this._className = "owidChart";
      this._unit = (options && options.unit) || "";
    
      this._valuesRange = d3.extent(this._data, (d:any) => d.value);
  
      this._dimensions = {
        years: (options && options.years) || this.getDimensionValues("year"),
        entities:
          (options && options.enitites) || this.getDimensionValues("entityName")
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
        .attr("class","tooltipContainer");
      
      this.setupSVGElements(this._chartSVG);
    
    }

    setupSVGElements(svg:d3.Selection<any, any, any, any>): any {
        svg
          .attr("class", this._className)
          .attr("fill", "currentColor")
          .attr("font-family", "system-ui, sans-serif")
          .attr("font-size", 10)
          .attr("text-anchor", "middle")
          .attr("width", this._widthTotal)
          .attr("height", this._heightTotal)
          .attr(
            "viewBox",
            `0 0 ${this._widthTotal} ${this._heightTotal}`
          )
          .call((svg) => svg.append("style").text(this.css()))
          .call((svg) =>
            svg
              .append("rect")
              .attr("width", this._widthTotal)
              .attr("height", this._heightTotal)
              .attr("fill", "white")
          );
    
        // If it does not already exists, we add a <g> element that will be the main container
        const mainContainer = svg.selectAll("g.container")
          .data([null])  // we will use D· data joins to create a single instance of the element
          .join("g")
          .attr("class", "container")
          .attr("transform", `translate(${this._marginLeft}, ${this._marginTop})`)
          .call((g) =>
            g
              .append("rect")
              .attr("class", "backgroundLayer")
              .attr("width", this._width)
              .attr("height", this._height)
              .attr("fill", "white")
          )
          .call((g) =>
            g
              .append("g")
              .attr("class", "axis x")
              .attr("transform", `translate(${0}, ${this._height})`)
          )
          .call((g) =>
            g
              .append("g")
              .attr("class", "axis y")
              .attr("transform", `translate(0,0)`)
          );
    
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
      .attr("transform", `translate(${0}, ${this._height})`)

    }

    handleMouseMove(e: any): void {
        const pos_relTarget = d3.pointer(e);
        const pos_relContainer = d3.pointer(e, this._chartContainer);
    }

    handleMouseLeave(): void {
        this._chartContent && this._chartContent.hideMarker();
    }


    protected getDimensionValues(dimension: string): any {
        return _.chain(this._data)
        .map((d: { [x: string]: any; }) => d[dimension])
        .uniq()
        .value();
    }


    protected getTextWidth(text: any, fontSize: string | number, fontFace: string):number {
        const canvas = document.createElement("canvas"),
          context = canvas.getContext("2d");

        let textWidth = null;
    
        if (context) {
            context.font = fontSize + "px " + fontFace;
            textWidth = context.measureText(text).width
        }


        return textWidth as number;
      
    }


    render() {
        return this._chartContainer.node();
    }

 

    css(): string  {
        return baseCSS;
    }



}

