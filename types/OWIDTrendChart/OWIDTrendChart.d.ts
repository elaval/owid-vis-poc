import * as d3 from 'd3';
import { OWIDChart } from '../OWIDChart/OWIDChart';
/**
 * Creates a line chart that shows the evolution of values on tine (years)
 *
 * For each entity we create a new series
 *
 * There is a marker that higights all points in a specific year (shown on mouse movement)
 *
 * There is a tooltip that displays values for all entities on a given year
 */
export declare class OWIDTrendChart extends OWIDChart {
    protected _scaleX: d3.ScaleLinear<number, number, never>;
    protected _scaleY: d3.ScaleLinear<number, number, never>;
    protected _axisX: d3.Axis<d3.NumberValue>;
    protected _axisY: d3.Axis<d3.NumberValue>;
    protected _seriesData: {
        name: string;
        data: any;
    }[];
    protected _selectedYearCallback: any;
    private _years;
    private _values;
    private _maxYear;
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
     * We display a "marker" which is a vertical line gor a given year
     *
     * All the dapapoints in the respective year will be highlighted with a higher radious
     *
     * @param year
     */
    showMarker(year: any): void;
    /**
     * We hide the markes (all dots go back to normal size and marker line is removed)
     */
    hideMarker(): void;
    /**
     * Gets / sets the callback function for selectedYear
     * @param _selectedYearCallback
     * @returns
     */
    selectedYearCallback(callback: Function): OWIDTrendChart | Function;
    /**
     * Handles visualization behaviour when the user moves the mouse on the chart
     *
     * We display a marker and a tooltip associated to the given year
     *
     * @param e event associated to the mouse movement
     * @param d data associated to the element that triggered the event
     * @param el   DOM element of the eleemnt that triggered the event
     */
    handleMouseMove(e: any, d: any, el: any): void;
    /**
     * Handle visualization behaviour when the user moves the mouse out the cghart region
     *
     * We hide marker and tooltip
     *
     * @param e event associated to the mouse movement
     * @param d data associated to the element that triggered the event
     * @param el DOM element of the eleemnt that triggered the event
     */
    handleMouseLeave(e: any, d: any, el: any): void;
    /**
     * We need to accomodate enough space on the left margin for the y axis ticks
     *
     * We estiemate the max width of the text for all ticks values and the unit descriptor
     *
     * @returns width Estimated margin space needed
     */
    calculateMarginLeft(): number;
    /**
     * We need to accomodate enough space on the right margin for the entities labels
     *
     * We estimate the max width of the text for all ticks values and the unit descriptor
     *
     * @returns witdh Estimated margin space needed
     */
    calculateMarginRight(): number;
    /**
     * We show a grid (lines on the chart) associated to each X tick
     */
    showGridX(): void;
    /**
     * We show a grid (lines on the chart) associated to each Y tick
     */
    showGridY(): void;
    /**
     * Given an x position on the chart, we estimate the closest year asociated to such position
     *
     * @param posX
     * @returns
     */
    getClosestYear(posX: number): number;
    /**
     * Gets the chart <div> element
     *
     * @returns <div> element
     */
    node(): any;
}
