import * as d3 from 'd3';
import * as _ from 'lodash';

import { baseCSS } from './OWIDChartCSS';

import {
  config
} from './OWIDChartConfig';

/**
 * Base class for chart components
 * 
 * This object will create a <div> DOM element that contains the 
 * <div class="chartDivContainer">
 *  <svg class="svgContainer">
 *    <g class="maincontainer">
 */
export class OWIDChart {
  protected _data: [] = [];

  protected _marginTop: number = config.marginTop;
  protected _marginBottom: number = config.marginBottom;
  protected _marginLeft: number = config.marginLeft;
  protected _marginRight: number = config.marginRight;

  protected _heightTotal: number = config.heightTotal;
  protected _widthTotal: number = config.widthTotal;

  /** _height / _width refer to internal visualization area (<g> maincontainer within <svg>) */
  protected _height: number;
  protected _width: number;

  protected _unit: string;
  protected _className: string;
  protected _valuesRange: [any, any];
  protected _dimensions: { years: any; entities: any; };
  protected _scaleColor: d3.ScaleOrdinal<string, string, never>;

  protected _mainDivContainer: d3.Selection<any, undefined, null, undefined>;
  protected _mainContainer: d3.Selection<any, undefined, null, undefined> ;

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

    // Redefine main visialization height / width according to current total heigh/width and margins
    this._height = this._heightTotal - this._marginBottom - this._marginTop;
    this._width = this._widthTotal - this._marginLeft - this._marginRight;

    this._y = (options && options.y) || {};
    this._x = (options && options.x) || {};

    this._unit = (options && options.unit) || "";
    this._className = "owidChart";
    this._unit = (options && options.unit) || "";

    this._valuesRange = d3.extent(this._data, (d: any) => d.value);

    this._dimensions = {
      years: (options && options.years) || this.getDimensionValues("year"),
      entities:
        (options && options.enitites) || this.getDimensionValues("entityName")
    };

    this._scaleColor = d3.scaleOrdinal(config.colorScheme);


    this._mainDivContainer = d3
      .create("div")
      .attr("class", "chart container")
      .attr("style", "position: relative; clear: both;");

    this._chartSVG = this._mainDivContainer
      .append("svg");

    this._mainContainer = this._chartSVG.append("g")

    this.setupSVGElements();
    this.baseStartupSettings();

  }

  setupSVGElements(): void {
    this._chartSVG
      .attr("class", `chart container ${this._className}`)
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
      .call((svg:any) => svg.append("style").text(this.css()))
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
      .attr("class", "chart main container")
      .attr("transform", `translate(${this._marginLeft}, ${this._marginTop})`)
      .call((g:any) =>
        g
          .append("rect")
          .attr("class", "backgroundLayer")
          .attr("width", this._width)
          .attr("height", this._height)
          .attr("fill", "white")
      )
      .call((g:any) =>
        g
          .append("g")
          .attr("class", "axis x")
          .attr("transform", `translate(${0}, ${this._height})`)
      )
      .call((g:any) =>
        g
          .append("g")
          .attr("class", "axis y")
          .attr("transform", `translate(0,0)`)
      );

  }

  /**
   * startupSettings()
   * Updated charts internat height / width dimensons based on current margins
   * 
   * This fucntion can / should be called after there has been a change in configurations (e.g. width)
   */
   protected baseStartupSettings(): void {

    this._chartSVG      
      .attr("width", this._widthTotal)
      .attr("height", this._heightTotal)
      .attr(
        "viewBox",
        `0 0 ${this._widthTotal} ${this._heightTotal}`
      )

    this._chartSVG
      .select("rect.bgLayer")
      .attr("width", this._widthTotal)
      .attr("height", this._heightTotal);

    this._chartSVG
      .select("g.container")
      .attr("transform", `translate(${this._marginLeft}, ${this._marginTop})`);

    this._chartSVG
      .select("g.main.container")
      .select("rect.backgroundLayer")
      .attr("width", this._width)
      .attr("height", this._height);


    this._chartSVG
      .select("g.main.container")
      .select("g.axis.x")
      .attr("transform", `translate(${0}, ${this._height})`)


    // Redefine main visialization height / width according to current total heigh/width and margins
    this._height = this._heightTotal - this._marginBottom - this._marginTop;
    this._width = this._widthTotal - this._marginLeft - this._marginRight;


    // Applies new left margin to our chart main <g> container
    this._chartSVG
      .select("g.container")
      .attr("transform", `translate(${this._marginLeft}, ${this._marginTop})`);

    this._mainContainer
      .select("rect.backgroundLayer")
      .attr("width", this._width)
      .attr("height", this._height);

    this._chartSVG
      .select("g.axis.x")
      .attr("transform", `translate(${0}, ${this._height})`)

  }

  protected startupSettings() {
    this.baseStartupSettings();
  }

    /**
   * Gets / sets the data source
   * @param data 
   * @returns current data | current OWIDBarChart object
   */
     data(data: []): OWIDChart | [] {
      if (arguments.length) {
        this._data = data;
        this.startupSettings();
        this.render();
        return this;
      } else {
        return this._data
      }
    }

  /**
   * Gets / sets the total chart width
   * @param width 
   * @returns current width | current OWIDBarChart object
   */
  width(width: number): OWIDChart | number {
    if (arguments.length) {
      this._widthTotal = width;
      this.startupSettings();
      this.render();
      return this;
    } else {
      return this._widthTotal
    }
  }

  /**
   * Gets / sets the unit associated to values in our data
   * @param unit 
   * @returns current unit | current OWIDBarChart object
   */
  unit(unit: string): OWIDChart | string {
      if (arguments.length) {
        this._unit = unit;
        this.startupSettings();
        this.render();
        return this;
      } else {
        return this._unit
      }
    }

  /**
   * Gets / sets the option for 
   * @param options 
   * @returns current unit | current OWIDBarChart object
   */
     x(options: {}): OWIDChart | {} {
      if (arguments.length) {
        this._x = options;
        this.startupSettings();
        this.render();
        return this;
      } else {
        return this._x
      }
    }
  
    /**
   * Gets / sets the option for 
   * @param options 
   * @returns current unit | current OWIDBarChart object
   */
    y(options: {}): OWIDChart | {} {
      if (arguments.length) {
        this._y = options;
        this.startupSettings();
        this.render();
        return this;
      } else {
        return this._y
      }
    }

  /**
   * Extracts from the data the collection of unique values for a given dimension (e.g. years / entityNames) 
   * 
   * @param dimension dimension included in the data ("year" | "entityName")
   * @returns array with dimension values
   */
  protected getDimensionValues(dimension: string): any {
    return _.chain(this._data)
      .map((d: { [x: string]: any; }) => d[dimension])
      .uniq()
      .value();
  }

 /**
   * Auxiliary function that gets the size of a text given the text / fontSize and fontFace
   * 
   * @param text 
   * @param fontSize 
   * @param fontFace 
   * @returns estinated text width
   */
  protected getTextWidth(text: any, fontSize: string | number, fontFace: string): number {
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

  }


  node() {
    return this._mainDivContainer.node();
  }



  css(): string {
    return baseCSS;
  }



}

