import * as d3 from 'd3';
import { OWIDChart } from '../OWIDChart/OWIDChart';
/**
 * Creates a horizontal bar chart with values associated to each entity for a given year
 *
 */
export declare class OWIDBarChart extends OWIDChart {
    protected _scaleX: d3.ScaleLinear<number, number, never>;
    protected _scaleY: d3.ScaleBand<any>;
    protected _axisX: d3.Axis<d3.NumberValue>;
    protected _axisY: d3.Axis<d3.NumberValue>;
    protected _year: number;
    protected _latestYear: any;
    protected _entities: any[];
    protected _singleYearData: any;
    protected _maxValue: any;
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
    constructor(data: any, options: any);
    /**
     * Configures / updates supporting data and objects (margins, width, height, scales, axes, series,... ) that
     * will be used for the visualization rendering
     *
     * This method should be called each time we update configurations that will affect the chart rendering
     * (e.g. after calling .data(), witdh(), ...)
     */
    protected startupSettings(): void;
    /**
     * Renders the visual elements of the chart inside the main <g> container
     *
     * Most of the DOM management is done using D3js
     */
    render(): void;
    /**
     * Gets / sets the year that is a target for our data
     * @param year
     * @returns
     */
    year(year: number): OWIDBarChart | number;
    /**
     * We need to accomodate enough space on the left margin for the y axis ticks
     *
     * We estiemate the max width of the text for all ticks values and the unit descriptor
     *
     * @returns width Estimated margin space needed
     */
    private calculateMarginLeft;
    /**
     * We need to accomodate enough space on the right margin for the entities labels
     *
     * We estimate the max width of the text for all ticks values and the unit descriptor
     *
     * @returns witdh Estimated margin space needed
     */
    private calculateMarginRight;
    /**
     * We show a grid (lines on the chart) associated to each X tick
     */
    showGridX(): void;
    /**
     * Gets the chart <div> element
     *
     * @returns <div> element
     */
    node(): any;
}
