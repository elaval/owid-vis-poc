import * as d3 from 'd3';
export declare class OWIDChart {
    protected _data: [];
    protected _marginTop: number;
    protected _marginBottom: number;
    protected _marginLeft: number;
    protected _marginRight: number;
    protected _heightTotal: number;
    protected _widthTotal: number;
    /** _height / _width refer to internal visualization area (<g> maincontainer within <svg>) */
    protected _height: number;
    protected _width: number;
    protected _unit: string;
    protected _className: string;
    protected _valuesRange: [any, any];
    protected _dimensions: {
        years: any;
        entities: any;
    };
    protected _scaleColor: d3.ScaleOrdinal<string, string, never>;
    protected _chartContainer: d3.Selection<any, undefined, null, undefined>;
    protected _chartSVG: any;
    protected _toolTip: any;
    protected _colorScale: any;
    protected _chartContent: any;
    protected _x: any;
    protected _y: any;
    constructor(data: any, options: any);
    setupSVGElements(): void;
    /**
     * startupSettings()
     * Updated charts internat height / width dimensons based on current margins
     *
     * This fucntion can / should be called after there has been a change in configurations (e.g. width)
     */
    protected baseStartupSettings(): void;
    protected startupSettings(): void;
    /**
     * Gets / sets the total chart width
     * @param width
     * @returns current width | current OWIDBarChart object
     */
    width(width: number): OWIDChart | number;
    /**
     * Gets / sets the unit associated to values in our data
     * @param unit
     * @returns current unit | current OWIDBarChart object
     */
    unit(unit: string): OWIDChart | string;
    /**
     * Gets / sets the option for
     * @param options
     * @returns current unit | current OWIDBarChart object
     */
    x(options: {}): OWIDChart | {};
    /**
   * Gets / sets the option for
   * @param options
   * @returns current unit | current OWIDBarChart object
   */
    y(options: {}): OWIDChart | {};
    handleMouseMove(e: any): void;
    handleMouseLeave(): void;
    protected getDimensionValues(dimension: string): any;
    protected getTextWidth(text: any, fontSize: string | number, fontFace: string): number;
    render(): void;
    node(): any;
    css(): string;
}
