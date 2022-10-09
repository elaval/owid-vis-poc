import { OWIDChart } from '../OWIDChart/OWIDChart';
/**
 * Creates a map that that shows values associated to each country in a color scale
 * Data is limited to a single year
 *
 */
export declare class OWIDMap extends OWIDChart {
    protected _year: number;
    protected _latestYear: any;
    protected _entities: any[];
    protected _singleYearData: any;
    protected _maxValue: any;
    private _dictValues;
    private _scaleValues;
    /**
      * Creates a new map visualization with country colors associated to the respective value
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
      *
      * @param data collection of {year:number; entityName:string, value:number} objects that will be used to render the visualization
      * @param options optional initial configuration options {year:number}
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
    year(year: number): OWIDMap | number;
    /**
     * Higlights a given country by modifying the borders width
     *
     * @param countryName
     */
    highlightCountry(countryName: any): void;
    /**
     * Unhighlights a given country (sets borders to default width)
     *
     * @param countryName
     */
    unHighlightCountry(countryName: any): void;
    /**
     * Handles mouse enter event on a given country
     *
     * The country is highlighted
     *
     * @param e event
     * @param d data object
     * @param el DOM element that triggered the event
     */
    handleMouseEnter(e: any, d: any, el: any): void;
    /**
     * Handles mouse move event on a given country
     *
     * Tooltip is shown for the given country
     *
     * @param e event
     * @param d data object
     * @param el DOM element that triggered the event
     */
    handleMouseMove(e: any, d: any, el: any): void;
    /**
     * Handles mouse move leave on a given country
     *
     * Country is unhighlighted and tooltip is hidden
     *
     * @param e event
     * @param d data object
     * @param el DOM element that triggered the event
     */
    handleMouseLeave(e: any, d: any, el: any): void;
    /**
     * Gets the chart <div> element
     *
     * @returns <div> element
     */
    node(): any;
}
